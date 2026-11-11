const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

initializeApp();

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");

const ROLE_LABELS = {
  director: "Director",
  principal: "Principal",
  administrator: "Administrator",
  academic_coordinator: "Academic Coordinator",
  admission_coordinator: "Admission Coordinator",
  activity_coordinator: "Activity Coordinator",
  sports_discipline_coordinator: "Sports & Discipline Coordinator",
  teacher: "Teacher",
  accountant: "Accountant",
  hr_manager: "HR Manager",
  staff: "Staff"
};

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

exports.sendStaffApprovalEmail = onDocumentUpdated(
  {
    document: "users/{userId}",
    region: "asia-south1",
    retry: true,
    secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS]
  },
  async event => {
    const before = event.data.before.data() || {};
    const after = event.data.after.data() || {};
    if (before.status !== "pending" || after.status !== "active") return;
    if ((after.accountType || "staff") !== "staff") return;

    const email = String(after.email || "").trim().toLowerCase();
    if (!email.endsWith("@baljyoti.com")) {
      console.warn("Approval email skipped: recipient is not a school staff address.", event.params.userId);
      return;
    }

    const role = String(after.role || "staff").toLowerCase().replace(/[ -]+/g, "_");
    const roleLabel = ROLE_LABELS[role] || "Staff";
    const db = getFirestore();
    const noticeRef = db.collection("mailNotifications").doc(event.params.userId + "_approval");

    const shouldSend = await db.runTransaction(async tx => {
      const snap = await tx.get(noticeRef);
      const notice = snap.exists ? snap.data() : {};
      if (notice.status === "sent") return false;
      if (notice.status === "sending" && notice.claimedAt &&
          Date.now() - notice.claimedAt.toMillis() < 5 * 60 * 1000) return false;
      tx.set(noticeRef, {
        type: "staff_approval",
        userId: event.params.userId,
        recipient: email,
        status: "sending",
        role,
        claimedAt: Timestamp.now(),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      return true;
    });
    if (!shouldSend) return;

    const port = Number(SMTP_PORT.value() || 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port,
      secure: port === 465,
      auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() }
    });

    const fullName = String(after.fullName || "Colleague").trim();
    const loginUrl = "https://baljyoti.com/app/login.html";
    const safeName = escapeHtml(fullName);
    const safeRole = escapeHtml(roleLabel);
    const subject = "Your Bal Jyoti School OS Account Has Been Approved";
    const text = [
      "Dear " + fullName + ",",
      "",
      "Your staff account for Bal Jyoti School OS has been approved.",
      "Your assigned role: " + roleLabel,
      "",
      "To access your workspace:",
      "1. Visit " + loginUrl,
      "2. Click Sign in with Google.",
      "3. Sign in using this approved school email address: " + email,
      "4. Your assigned role and permissions will appear automatically.",
      "",
      "Please use only your official @baljyoti.com account.",
      "",
      "For login assistance, contact the school administration.",
      "",
      "Regards,",
      "IT & Administration Team",
      "Bal Jyoti Public School"
    ].join("\n");

    const html = `<!doctype html><html><body style="margin:0;background:#f7f8fa;font-family:Arial,sans-serif;color:#252525">
      <div style="max-width:600px;margin:24px auto;background:#fff;border:1px solid #e8e8e8;border-radius:10px;overflow:hidden">
        <div style="background:#a71920;color:#fff;padding:22px 26px;font-size:20px;font-weight:bold">Bal Jyoti Public School</div>
        <div style="padding:26px">
          <h2 style="font-size:20px;margin:0 0 18px;color:#a71920">Your School OS account is approved</h2>
          <p>Dear ${safeName},</p>
          <p>Your staff account for <strong>Bal Jyoti School OS</strong> has been approved.</p>
          <p><strong>Assigned role:</strong> ${safeRole}</p>
          <p>To access your workspace:</p>
          <ol>
            <li>Visit <a href="${loginUrl}">${loginUrl}</a></li>
            <li>Click <strong>Sign in with Google</strong>.</li>
            <li>Use your approved school email: <strong>${escapeHtml(email)}</strong></li>
            <li>Your role and permissions will appear automatically.</li>
          </ol>
          <p>Please use only your official <strong>@baljyoti.com</strong> account.</p>
          <p>For login assistance, contact the school administration.</p>
          <p style="margin-top:28px">Regards,<br><strong>IT &amp; Administration Team</strong><br>Bal Jyoti Public School</p>
        </div>
      </div></body></html>`;

    try {
      const result = await transporter.sendMail({
        from: '"Bal Jyoti Public School" <info@baljyoti.com>',
        to: email,
        subject,
        text,
        html
      });
      await noticeRef.set({
        status: "sent",
        messageId: result.messageId || "",
        sentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      await event.data.after.ref.set({
        approvalEmailStatus: "sent",
        approvalEmailSentAt: FieldValue.serverTimestamp(),
        approvalEmailError: FieldValue.delete()
      }, { merge: true });
      console.info("Staff approval email sent.", event.params.userId);
    } catch (error) {
      await noticeRef.set({
        status: "failed",
        error: String(error.message || error).slice(0, 500),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
      await event.data.after.ref.set({
        approvalEmailStatus: "failed",
        approvalEmailError: String(error.message || error).slice(0, 500)
      }, { merge: true });
      throw error;
    }
  }
);


// Secure School OS user administration (staging-first deployment).
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");

const ADMIN_ROLES = {
  director: "Director",
  principal: "Principal",
  administrator: "Administrator",
  academic_coordinator: "Academic Coordinator",
  admission_coordinator: "Admission Coordinator",
  activity_coordinator: "Activity Coordinator",
  sports_discipline_coordinator: "Sports & Discipline Coordinator",
  teacher: "Teacher",
  accountant: "Accountant",
  hr_manager: "HR Manager",
  staff: "Staff"
};

async function requireSuperAdmin(request) {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("unauthenticated", "Please sign in as Super Admin.");
  }
  const db = getFirestore();
  const snap = await db.collection("users").doc(request.auth.uid).get();
  if (!snap.exists || snap.data().role !== "super_admin" || snap.data().status !== "active") {
    throw new HttpsError("permission-denied", "Only an active Super Admin can perform this action.");
  }
  return { uid: request.auth.uid, email: request.auth.token.email || "" };
}

exports.approveStaffUser = onCall({ region: "asia-south1" }, async request => {
  const admin = await requireSuperAdmin(request);
  const targetUid = String(request.data && request.data.userId || "").trim();
  const role = String(request.data && request.data.role || "").trim().toLowerCase();
  if (!targetUid || !ADMIN_ROLES[role]) {
    throw new HttpsError("invalid-argument", "Select a valid staff account and approved role.");
  }
  const db = getFirestore();
  const userRef = db.collection("users").doc(targetUid);
  const roleRef = db.doc("system/roleRegistry");
  const accessRef = db.doc("system/roleModuleAccess");
  await db.runTransaction(async tx => {
    const [userSnap, roleSnap, accessSnap] = await Promise.all([
      tx.get(userRef), tx.get(roleRef), tx.get(accessRef)
    ]);
    if (!userSnap.exists) throw new HttpsError("not-found", "Staff profile was not found.");
    const user = userSnap.data();
    if (user.status !== "pending" || (user.accountType || "staff") !== "staff") {
      throw new HttpsError("failed-precondition", "Only pending staff profiles can be approved here.");
    }
    if (!String(user.email || "").toLowerCase().endsWith("@baljyoti.com")) {
      throw new HttpsError("failed-precondition", "Staff approval requires an official @baljyoti.com email.");
    }
    const roles = roleSnap.exists ? (roleSnap.data().roles || {}) : {};
    const access = accessSnap.exists ? (accessSnap.data().access || {}) : {};
    if (!roles[role]) roles[role] = { label: ADMIN_ROLES[role], active: true };
    if (!Array.isArray(access[role])) access[role] = [];
    tx.set(roleRef, { roles, updatedAt: FieldValue.serverTimestamp(), updatedBy: admin.uid }, { merge: true });
    tx.set(accessRef, { access, updatedAt: FieldValue.serverTimestamp(), updatedBy: admin.uid }, { merge: true });
    tx.update(userRef, {
      role, accountType: "staff", status: "active",
      approvedBy: admin.uid, approvedByEmail: admin.email,
      approvedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    const auditRef = db.collection("auditLogs").doc();
    tx.set(auditRef, {
      action: "staff_approved", targetUserId: targetUid, targetEmail: user.email || "",
      assignedRole: role, performedBy: admin.uid, performedAt: FieldValue.serverTimestamp()
    });
  });
  return { success: true, role, roleLabel: ADMIN_ROLES[role] };
});

exports.deleteSchoolUser = onCall({ region: "asia-south1" }, async request => {
  const admin = await requireSuperAdmin(request);
  const targetUid = String(request.data && request.data.userId || "").trim();
  if (!targetUid || targetUid === admin.uid) {
    throw new HttpsError("failed-precondition", "You cannot delete your own Super Admin account.");
  }
  const db = getFirestore();
  const userRef = db.collection("users").doc(targetUid);
  const snap = await userRef.get();
  if (!snap.exists) throw new HttpsError("not-found", "User profile was not found.");
  const profile = snap.data();
  if (profile.role === "super_admin") {
    throw new HttpsError("failed-precondition", "A Super Admin account cannot be deleted from User Management.");
  }
  try {
    await getAuth().deleteUser(targetUid);
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;
  }
  const auditRef = db.collection("auditLogs").doc();
  await db.runTransaction(async tx => {
    const current = await tx.get(userRef);
    if (!current.exists) throw new HttpsError("not-found", "User profile was already removed.");
    tx.set(auditRef, {
      action: "user_deleted", targetUserId: targetUid,
      targetEmail: profile.email || "", targetRole: profile.role || "",
      performedBy: admin.uid, performedAt: FieldValue.serverTimestamp(),
      historicalRecordsRetained: true
    });
    tx.delete(userRef);
  });
  return { success: true, historicalRecordsRetained: true };
});


// Per-user module exceptions. These affect navigation/module access only;
// record-level Firestore rules remain the authority for school data.
exports.setUserModuleOverrides = onCall({ region: "asia-south1" }, async request => {
  const admin = await requireSuperAdmin(request);
  const targetUid = String(request.data && request.data.userId || "").trim();
  const allow = request.data && request.data.allow;
  const deny = request.data && request.data.deny;
  if (!targetUid || targetUid === admin.uid || !Array.isArray(allow) || !Array.isArray(deny)) {
    throw new HttpsError("invalid-argument", "Select a non-Super Admin user and provide allow/deny module lists.");
  }
  if (allow.length > 100 || deny.length > 100 ||
      [...allow, ...deny].some(x => typeof x !== "string" || x.length > 100)) {
    throw new HttpsError("invalid-argument", "The module permission list is invalid.");
  }
  const allowSet = [...new Set(allow)];
  const denySet = [...new Set(deny)];
  if (allowSet.some(x => denySet.includes(x))) {
    throw new HttpsError("invalid-argument", "A module cannot be both allowed and denied.");
  }
  const db = getFirestore();
  const userRef = db.collection("users").doc(targetUid);
  const moduleRef = db.doc("system/moduleRegistry");
  const overrideRef = db.collection("userModuleOverrides").doc(targetUid);
  const auditRef = db.collection("auditLogs").doc();
  await db.runTransaction(async tx => {
    const [userSnap, moduleSnap] = await Promise.all([tx.get(userRef), tx.get(moduleRef)]);
    if (!userSnap.exists) throw new HttpsError("not-found", "The selected user was not found.");
    const user = userSnap.data();
    if (user.role === "super_admin" || user.status === "deleted") {
      throw new HttpsError("failed-precondition", "Super Admin or deleted accounts cannot receive custom module overrides.");
    }
    if (!moduleSnap.exists) throw new HttpsError("failed-precondition", "The module registry is not configured.");
    const modules = moduleSnap.data().modules || [];
    const validIds = new Set(modules.filter(m => m && m.id && m.active !== false).map(m => m.id));
    if ([...allowSet, ...denySet].some(id => !validIds.has(id))) {
      throw new HttpsError("invalid-argument", "One or more selected modules are not active in the module registry.");
    }
    tx.set(overrideRef, {
      userId: targetUid,
      allow: allowSet,
      deny: denySet,
      updatedBy: admin.uid,
      updatedAt: FieldValue.serverTimestamp()
    });
    tx.set(auditRef, {
      action: "user_module_overrides_updated",
      targetUserId: targetUid,
      targetEmail: user.email || "",
      allowedModules: allowSet,
      deniedModules: denySet,
      performedBy: admin.uid,
      performedAt: FieldValue.serverTimestamp()
    });
  });
  return { success: true, allow: allowSet, deny: denySet };
});


// Shared server-validated school workflows.
Object.assign(exports, require("./school-services"));
