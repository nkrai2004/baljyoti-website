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
