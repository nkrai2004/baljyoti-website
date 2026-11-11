"use strict";

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const db = getFirestore();

const MANAGERS = new Set(["super_admin", "director", "principal", "administrator", "admission_coordinator"]);
const FIELDS = ["admissionNo", "firstName", "lastName", "className", "section", "guardianName", "status"];

function clean(value, max) {
  return String(value == null ? "" : value).trim().replace(/\\s+/g, " ").slice(0, max);
}
function validStudent(data) {
  return !!(clean(data.admissionNo, 32) && clean(data.firstName, 80) &&
    clean(data.lastName, 80) && clean(data.className, 40) &&
    clean(data.section, 20) && clean(data.guardianName, 120) &&
    ["active", "inactive"].includes(data.status || "active"));
}
async function actorFor(request) {
  if (!request.auth || !request.auth.uid) throw new HttpsError("unauthenticated", "Please sign in.");
  const uid = request.auth.uid;
  const email = String(request.auth.token.email || "").trim().toLowerCase();
  const [profileSnap, rolesSnap, accessSnap, overrideSnap] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.doc("system/roleRegistry").get(),
    db.doc("system/roleModuleAccess").get(),
    db.collection("userModuleOverrides").doc(uid).get()
  ]);
  if (!profileSnap.exists || profileSnap.data().status !== "active" ||
      String(profileSnap.data().email || "").trim().toLowerCase() !== email) {
    throw new HttpsError("permission-denied", "Your active school profile could not be verified.");
  }
  const role = String(profileSnap.data().role || "").toLowerCase().replace(/[ -]+/g, "_");
  if (!rolesSnap.exists || !rolesSnap.data().roles ||
      !rolesSnap.data().roles[role] || rolesSnap.data().roles[role].active === false) {
    throw new HttpsError("permission-denied", "Your school role is not active.");
  }
  let grants = accessSnap.exists && Array.isArray((accessSnap.data().access || {})[role])
    ? (accessSnap.data().access || {})[role].slice() : [];
  if (overrideSnap.exists) {
    const custom = overrideSnap.data() || {};
    const allow = Array.isArray(custom.allow) ? custom.allow : [];
    const deny = Array.isArray(custom.deny) ? custom.deny : [];
    grants = [...new Set([...grants, ...allow])].filter(id => !deny.includes(id));
  }
  if (role !== "super_admin" && !grants.includes("*") && !grants.includes("student_records")) {
    throw new HttpsError("permission-denied", "Your account does not have Student Records module access.");
  }
  if (!MANAGERS.has(role)) throw new HttpsError("permission-denied", "Your role cannot manage student master records.");
  return { uid, email, role };
}
function audit(actor, action, studentId, extra) {
  return db.collection("auditLogs").add(Object.assign({
    actorUid: actor.uid, actorEmail: actor.email, actorRole: actor.role,
    action, collection: "students", recordId: studentId || null,
    timestamp: FieldValue.serverTimestamp()
  }, extra || {}));
}

exports.listStudents = onCall({ region: "asia-south1" }, async request => {
  await actorFor(request);
  const snap = await db.collection("students").orderBy("admissionNo").limit(200).get();
  return { students: snap.docs.map(doc => {
    const d = doc.data();
    return { id: doc.id, admissionNo: d.admissionNo, firstName: d.firstName,
      lastName: d.lastName, className: d.className, section: d.section,
      guardianName: d.guardianName, status: d.status, isSample: d.isSample === true };
  }) };
});

exports.saveStudent = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const data = request.data || {};
  const student = {
    admissionNo: clean(data.admissionNo, 32),
    firstName: clean(data.firstName, 80),
    lastName: clean(data.lastName, 80),
    className: clean(data.className, 40),
    section: clean(data.section, 20),
    guardianName: clean(data.guardianName, 120),
    status: data.status === "inactive" ? "inactive" : "active"
  };
  if (!validStudent(student)) throw new HttpsError("invalid-argument", "Complete all required student fields.");
  const studentId = clean(data.studentId, 128);
  const duplicate = await db.collection("students").where("admissionNo", "==", student.admissionNo).limit(2).get();
  if (duplicate.docs.some(doc => doc.id !== studentId)) {
    throw new HttpsError("already-exists", "That admission number is already in use.");
  }
  const ref = studentId ? db.collection("students").doc(studentId) : db.collection("students").doc();
  if (studentId) {
    const existing = await ref.get();
    if (!existing.exists) throw new HttpsError("not-found", "Student record not found.");
    await ref.update(Object.assign(student, { updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid }));
  } else {
    await ref.create(Object.assign(student, {
      isSample: false, createdAt: FieldValue.serverTimestamp(),
      createdBy: actor.uid, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.uid
    }));
  }
  await audit(actor, studentId ? "student_updated" : "student_created", ref.id,
    { admissionNo: student.admissionNo });
  return { success: true, studentId: ref.id };
});

exports.archiveStudent = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const studentId = clean(request.data && request.data.studentId, 128);
  if (!studentId) throw new HttpsError("invalid-argument", "Student record is required.");
  const ref = db.collection("students").doc(studentId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "Student record not found.");
  await ref.update({ status: "inactive", archivedAt: FieldValue.serverTimestamp(), archivedBy: actor.uid });
  await audit(actor, "student_archived", studentId, { admissionNo: snap.data().admissionNo || "" });
  return { success: true };
});

exports.seedSampleStudents = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  if (actor.role !== "super_admin") throw new HttpsError("permission-denied", "Only Super Admin can initialise sample records.");
  const samples = [
    ["BJ-SAMPLE-001", "Aarav", "Sharma", "Class V", "A", "Sample Guardian One"],
    ["BJ-SAMPLE-002", "Ananya", "Verma", "Class V", "A", "Sample Guardian Two"],
    ["BJ-SAMPLE-003", "Kabir", "Singh", "Class VI", "B", "Sample Guardian Three"],
    ["BJ-SAMPLE-004", "Meera", "Gupta", "Class IV", "A", "Sample Guardian Four"],
    ["BJ-SAMPLE-005", "Ishaan", "Kumar", "Class VII", "A", "Sample Guardian Five"]
  ];
  const results = [];
  for (const row of samples) {
    const existing = await db.collection("students").where("admissionNo", "==", row[0]).limit(1).get();
    if (existing.empty) {
      const ref = db.collection("students").doc();
      await ref.create({
        admissionNo: row[0], firstName: row[1], lastName: row[2],
        className: row[3], section: row[4], guardianName: row[5],
        status: "active", isSample: true, createdBy: actor.uid,
        createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
      });
      results.push({ admissionNo: row[0], created: true });
    } else results.push({ admissionNo: row[0], created: false });
  }
  await audit(actor, "student_sample_data_initialised", null, { count: results.filter(x => x.created).length });
  return { success: true, results };
});
