"use strict";

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { defineSecret } = require("firebase-functions/params");
const db = getFirestore();

const SHEETS_API_URL = defineSecret("SHEETS_API_URL");
const SHEETS_API_KEY = defineSecret("SHEETS_API_KEY");
const SHEETS_SECRETS = [SHEETS_API_URL, SHEETS_API_KEY];
const MANAGERS = new Set(["super_admin", "director", "principal", "administrator", "admission_coordinator"]);

function clean(value, max) {
  return String(value == null ? "" : value).trim().replace(/\s+/g, " ").slice(0, max);
}
function validStudent(data) {
  return !!(clean(data.admissionNo, 32) && clean(data.firstName, 80) &&
    clean(data.lastName, 80) && clean(data.className, 40) &&
    clean(data.section, 20) && clean(data.guardianName, 120) &&
    ["active", "inactive"].includes(data.status || "active"));
}
async function sheets(action, payload) {
  let response;
  try {
    response = await fetch(SHEETS_API_URL.value(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action, apiKey: SHEETS_API_KEY.value() }, payload || {}))
    });
  } catch (error) {
    throw new HttpsError("unavailable", "The Google Sheets database is not reachable.");
  }
  const result = await response.json();
  if (!response.ok || !result.ok) {
    const message = String(result.error || "Google Sheets database request failed.");
    throw new HttpsError("failed-precondition", message);
  }
  return result.result;
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
async function audit(actor, action, studentId, details) {
  return sheets("appendAudit", { entry: {
    actorUid: actor.uid, actorRole: actor.role, action,
    entity: "Students", entityId: studentId || "", details: details || {}
  }});
}

exports.listStudents = onCall({ region: "asia-south1", secrets: SHEETS_SECRETS }, async request => {
  await actorFor(request);
  return { students: await sheets("listStudents") };
});

exports.saveStudent = onCall({ region: "asia-south1", secrets: SHEETS_SECRETS }, async request => {
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
  const result = await sheets("saveStudent", { student: Object.assign(student, { id: studentId }) });
  await audit(actor, studentId ? "student_updated" : "student_created", result.id, { admissionNo: student.admissionNo });
  return { success: true, studentId: result.id };
});

exports.archiveStudent = onCall({ region: "asia-south1", secrets: SHEETS_SECRETS }, async request => {
  const actor = await actorFor(request);
  const studentId = clean(request.data && request.data.studentId, 128);
  if (!studentId) throw new HttpsError("invalid-argument", "Student record is required.");
  const result = await sheets("archiveStudent", { recordId: studentId });
  await audit(actor, "student_archived", studentId, {});
  return { success: true, result };
});

exports.seedSampleStudents = onCall({ region: "asia-south1", secrets: SHEETS_SECRETS }, async request => {
  const actor = await actorFor(request);
  if (actor.role !== "super_admin") throw new HttpsError("permission-denied", "Only Super Admin can initialise sample records.");
  const result = await sheets("seedSampleStudents");
  await audit(actor, "student_sample_data_initialised", "", result);
  return Object.assign({ success: true }, result);
});
