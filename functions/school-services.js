"use strict";

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();
const {
  cleanText: clean,
  isValidDate: validDate,
  normalizeAudience,
  hasValidAudience,
  validRejectionReason
} = require("./workflow-validation");
const LEADERS = new Set(["super_admin", "director", "principal", "administrator"]);
const NOTICE_AUTHORS = new Set(["super_admin", "director", "principal", "administrator", "academic_coordinator", "admission_coordinator", "activity_coordinator", "sports_discipline_coordinator", "teacher", "accountant", "hr_manager", "staff"]);
const CALENDAR_AUTHORS = new Set(["super_admin", "director", "principal", "administrator", "academic_coordinator", "admission_coordinator", "activity_coordinator", "sports_discipline_coordinator", "teacher", "staff"]);

function fail(condition, message) { if (condition) throw new HttpsError("invalid-argument", message); }
async function actorFor(request) {
  if (!request.auth || !request.auth.uid) throw new HttpsError("unauthenticated", "Please sign in.");
  const snap = await db.collection("users").doc(request.auth.uid).get();
  if (!snap.exists) throw new HttpsError("permission-denied", "Your school profile is missing.");
  const profile = snap.data() || {};
  if (!isActiveProfile(profile, request.auth.token.email)) {
    throw new HttpsError("permission-denied", "Your school profile is not active or does not match your Google account.");
  }
  return { uid: request.auth.uid, email: request.auth.token.email || "", role: String(profile.role || "").toLowerCase(), profile };
}
function requireRole(actor, roles) {
  if (!hasRole(actor.role, roles)) throw new HttpsError("permission-denied", "Your role cannot perform this action.");
}
function audit(tx, actor, action, collection, recordId, extra) {
  const ref = db.collection("auditLogs").doc();
  tx.set(ref, Object.assign({ actorUid: actor.uid, actorEmail: actor.email, action, collection, recordId, timestamp: FieldValue.serverTimestamp() }, extra || {}));
}

exports.createSchoolTask = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, LEADERS);
  const data = request.data || {};
  const title = clean(data.title, 140);
  const description = clean(data.description, 2000);
  const assigneeUid = clean(data.assigneeUid, 128);
  const dueDate = data.dueDate || "";
  const priority = ["low", "normal", "high", "urgent"].includes(data.priority) ? data.priority : "normal";
  fail(!title || !assigneeUid, "A task title and assignee are required.");
  fail(dueDate && !validDate(dueDate), "Use a valid YYYY-MM-DD due date.");
  const assigneeSnap = await db.collection("users").doc(assigneeUid).get();
  if (!assigneeSnap.exists || assigneeSnap.data().status !== "active" || (assigneeSnap.data().accountType || "staff") !== "staff") {
    throw new HttpsError("failed-precondition", "Tasks can only be assigned to active staff accounts.");
  }
  const ref = db.collection("schoolTasks").doc();
  await db.runTransaction(async tx => {
    tx.create(ref, { title, description, assigneeUid, assigneeName: clean(assigneeSnap.data().fullName, 120), assignedByUid: actor.uid, assignedByRole: actor.role, dueDate: dueDate || null, priority, status: "open", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    audit(tx, actor, "school_task_created", "schoolTasks", ref.id, { assigneeUid, priority });
  });
  return { success: true, taskId: ref.id, status: "open" };
});

exports.updateSchoolTaskStatus = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const data = request.data || {};
  const taskId = clean(data.taskId, 128);
  const status = clean(data.status, 24);
  fail(!taskId || !["open", "in_progress", "completed"].includes(status), "Select a valid task and status.");
  const ref = db.collection("schoolTasks").doc(taskId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Task not found.");
    const task = snap.data();
    if (!canUpdateTask(actor.uid, task.assigneeUid, actor.role)) requireRole(actor, LEADERS);
    tx.update(ref, { status, updatedAt: FieldValue.serverTimestamp(), lastUpdatedByUid: actor.uid });
    audit(tx, actor, "school_task_status_changed", "schoolTasks", taskId, { previousStatus: task.status, newStatus: status });
  });
  return { success: true, taskId, status };
});

exports.submitSchoolNotice = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, NOTICE_AUTHORS);
  const data = request.data || {};
  const title = clean(data.title, 140);
  const body = clean(data.body, 4000);
  const audience = normalizeAudience(data.audience);
  fail(!title || !body || !hasValidAudience(audience), "Choose one or more supported audience groups.");
  const ref = db.collection("schoolNotices").doc();
  await db.runTransaction(async tx => {
    tx.create(ref, { title, body, audience, category: clean(data.category, 40) || "general", authorUid: actor.uid, authorRole: actor.role, status: "pending_approval", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    audit(tx, actor, "school_notice_submitted", "schoolNotices", ref.id, { audienceCount: audience.length });
  });
  return { success: true, noticeId: ref.id, status: "pending_approval" };
});

exports.reviewSchoolNotice = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, new Set(["super_admin", "director", "principal"]));
  const data = request.data || {};
  const noticeId = clean(data.noticeId, 128);
  const decision = clean(data.decision, 20);
  const reason = clean(data.reason, 500);
  fail(!noticeId || !["approve", "reject"].includes(decision) || !validRejectionReason(decision, reason), "Select a decision and provide a reason of at least 3 characters when rejecting.");
  const ref = db.collection("schoolNotices").doc(noticeId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Notice not found.");
    const notice = snap.data();
    if (notice.status !== "pending_approval") throw new HttpsError("failed-precondition", "Only pending notices can be reviewed.");
    if (!canReviewSubmission(actor.uid, notice.authorUid, actor.role)) throw new HttpsError("permission-denied", "Your role cannot review this notice or you are its author.");
    tx.update(ref, { status: decision === "approve" ? "published" : "rejected", reviewedByUid: actor.uid, reviewedByRole: actor.role, reviewReason: reason, reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    audit(tx, actor, decision === "approve" ? "school_notice_approved" : "school_notice_rejected", "schoolNotices", noticeId, { authorUid: notice.authorUid });
  });
  return { success: true, noticeId, status: decision === "approve" ? "published" : "rejected" };
});

exports.submitSchoolCalendarEvent = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, CALENDAR_AUTHORS);
  const data = request.data || {};
  const title = clean(data.title, 140);
  const description = clean(data.description, 2000);
  const startDate = data.startDate || "";
  const endDate = data.endDate || startDate;
  fail(!title || !validDate(startDate) || !validDate(endDate) || endDate < startDate, "Provide a title and valid event dates.");
  const audience = normalizeAudience(data.audience);
  fail(!hasValidAudience(audience), "Choose one or more supported audience groups.");
  const ref = db.collection("schoolCalendarEvents").doc();
  await db.runTransaction(async tx => {
    tx.create(ref, { title, description, startDate, endDate, audience, category: clean(data.category, 40) || "school", location: clean(data.location, 160), createdByUid: actor.uid, createdByRole: actor.role, status: "pending_approval", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    audit(tx, actor, "school_calendar_event_submitted", "schoolCalendarEvents", ref.id, { startDate, endDate });
  });
  return { success: true, eventId: ref.id, status: "pending_approval" };
});

exports.reviewSchoolCalendarEvent = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, new Set(["super_admin", "director", "principal"]));
  const data = request.data || {};
  const eventId = clean(data.eventId, 128);
  const decision = clean(data.decision, 20);
  const reason = clean(data.reason, 500);
  fail(!eventId || !["approve", "reject"].includes(decision) || !validRejectionReason(decision, reason), "Select a decision and provide a reason of at least 3 characters when rejecting.");
  const ref = db.collection("schoolCalendarEvents").doc(eventId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Calendar event not found.");
    const event = snap.data();
    if (event.status !== "pending_approval") throw new HttpsError("failed-precondition", "Only pending events can be reviewed.");
    if (!canReviewSubmission(actor.uid, event.createdByUid, actor.role)) throw new HttpsError("permission-denied", "Your role cannot review this event or you are its author.");
    tx.update(ref, { status: decision === "approve" ? "published" : "rejected", reviewedByUid: actor.uid, reviewedByRole: actor.role, reviewReason: reason, reviewedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    audit(tx, actor, decision === "approve" ? "school_calendar_event_approved" : "school_calendar_event_rejected", "schoolCalendarEvents", eventId, { createdByUid: event.createdByUid });
  });
  return { success: true, eventId, status: decision === "approve" ? "published" : "rejected" };
});

// Bounded, identity-scoped reads. Audience-based publication reads are deliberately
// excluded until canonical class/section/responsibility membership is implemented.
function dateValue(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return null;
}
function taskView(doc) {
  const x = doc.data();
  return {
    id: doc.id, title: x.title || "", description: x.description || "",
    assigneeUid: x.assigneeUid || "", assigneeName: x.assigneeName || "",
    assignedByUid: x.assignedByUid || "", dueDate: x.dueDate || null,
    priority: x.priority || "normal", status: x.status || "open",
    createdAt: dateValue(x.createdAt), updatedAt: dateValue(x.updatedAt)
  };
}
function noticeView(doc) {
  const x = doc.data();
  return {
    id: doc.id, title: x.title || "", body: x.body || "",
    audience: Array.isArray(x.audience) ? x.audience : [],
    category: x.category || "general", authorUid: x.authorUid || "",
    authorRole: x.authorRole || "", status: x.status || "", reviewReason: x.reviewReason || "",
    createdAt: dateValue(x.createdAt), reviewedAt: dateValue(x.reviewedAt)
  };
}
function eventView(doc) {
  const x = doc.data();
  return {
    id: doc.id, title: x.title || "", description: x.description || "",
    startDate: x.startDate || "", endDate: x.endDate || "",
    audience: Array.isArray(x.audience) ? x.audience : [],
    category: x.category || "school", location: x.location || "",
    createdByUid: x.createdByUid || "", createdByRole: x.createdByRole || "",
    status: x.status || "", reviewReason: x.reviewReason || "", createdAt: dateValue(x.createdAt),
    reviewedAt: dateValue(x.reviewedAt)
  };
}

exports.listMySchoolTasks = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const snap = await db.collection("schoolTasks")
    .where("assigneeUid", "==", actor.uid).limit(50).get();
  const items = snap.docs.map(taskView)
    .sort((a, b) => String(a.dueDate || "9999-12-31").localeCompare(String(b.dueDate || "9999-12-31")));
  return { items, limit: 50 };
});

exports.listMySchoolNoticeSubmissions = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const snap = await db.collection("schoolNotices")
    .where("authorUid", "==", actor.uid).limit(50).get();
  const items = snap.docs.map(noticeView)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return { items, limit: 50 };
});

exports.listPendingSchoolNotices = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, new Set(["super_admin", "director", "principal"]));
  const snap = await db.collection("schoolNotices")
    .where("status", "==", "pending_approval").limit(50).get();
  const items = snap.docs.map(noticeView)
    .filter(item => item.authorUid !== actor.uid)
    .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
  return { items, limit: 50 };
});

exports.listMySchoolCalendarSubmissions = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  const snap = await db.collection("schoolCalendarEvents")
    .where("createdByUid", "==", actor.uid).limit(50).get();
  const items = snap.docs.map(eventView)
    .sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")));
  return { items, limit: 50 };
});

exports.listPendingSchoolCalendarEvents = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, new Set(["super_admin", "director", "principal"]));
  const snap = await db.collection("schoolCalendarEvents")
    .where("status", "==", "pending_approval").limit(50).get();
  const items = snap.docs.map(eventView)
    .filter(item => item.createdByUid !== actor.uid)
    .sort((a, b) => String(a.startDate || "").localeCompare(String(b.startDate || "")));
  return { items, limit: 50 };
});

exports.resubmitRejectedSchoolNotice = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, NOTICE_AUTHORS);
  const data = request.data || {};
  const noticeId = clean(data.noticeId, 128);
  const title = clean(data.title, 140);
  const body = clean(data.body, 4000);
  const audience = normalizeAudience(data.audience);
  fail(!noticeId || !title || !body || !hasValidAudience(audience), "Provide a valid notice ID, title, message and supported audience.");
  const ref = db.collection("schoolNotices").doc(noticeId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Notice not found.");
    const notice = snap.data();
    if (notice.authorUid !== actor.uid) throw new HttpsError("permission-denied", "Only the original author can resubmit this notice.");
    if (notice.status !== "rejected") throw new HttpsError("failed-precondition", "Only rejected notices can be resubmitted.");
    tx.update(ref, {
      title, body, audience, category: clean(data.category, 40) || "general",
      status: "pending_approval", reviewReason: FieldValue.delete(),
      reviewedByUid: FieldValue.delete(), reviewedByRole: FieldValue.delete(),
      reviewedAt: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp(),
      resubmittedAt: FieldValue.serverTimestamp(), resubmissionCount: (notice.resubmissionCount || 0) + 1
    });
    audit(tx, actor, "school_notice_resubmitted", "schoolNotices", noticeId, { resubmissionCount: (notice.resubmissionCount || 0) + 1 });
  });
  return { success: true, noticeId, status: "pending_approval" };
});

exports.resubmitRejectedSchoolCalendarEvent = onCall({ region: "asia-south1" }, async request => {
  const actor = await actorFor(request);
  requireRole(actor, CALENDAR_AUTHORS);
  const data = request.data || {};
  const eventId = clean(data.eventId, 128);
  const title = clean(data.title, 140);
  const description = clean(data.description, 2000);
  const startDate = data.startDate || "";
  const endDate = data.endDate || startDate;
  const audience = normalizeAudience(data.audience);
  fail(!eventId || !title || !validDate(startDate) || !validDate(endDate) || endDate < startDate || !hasValidAudience(audience), "Provide valid event details, dates and supported audience.");
  const ref = db.collection("schoolCalendarEvents").doc(eventId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Calendar event not found.");
    const event = snap.data();
    if (event.createdByUid !== actor.uid) throw new HttpsError("permission-denied", "Only the original author can resubmit this event.");
    if (event.status !== "rejected") throw new HttpsError("failed-precondition", "Only rejected events can be resubmitted.");
    const count = (event.resubmissionCount || 0) + 1;
    tx.update(ref, {
      title, description, startDate, endDate, audience,
      category: clean(data.category, 40) || "school", location: clean(data.location, 160),
      status: "pending_approval", reviewReason: FieldValue.delete(),
      reviewedByUid: FieldValue.delete(), reviewedByRole: FieldValue.delete(),
      reviewedAt: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp(),
      resubmittedAt: FieldValue.serverTimestamp(), resubmissionCount: count
    });
    audit(tx, actor, "school_calendar_event_resubmitted", "schoolCalendarEvents", eventId, { resubmissionCount: count });
  });
  return { success: true, eventId, status: "pending_approval" };
});

