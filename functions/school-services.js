"use strict";

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();
const LEADERS = new Set(["super_admin", "director", "principal", "administrator"]);
const NOTICE_AUTHORS = new Set(["super_admin", "director", "principal", "administrator", "academic_coordinator", "admission_coordinator", "activity_coordinator", "sports_discipline_coordinator", "teacher", "accountant", "hr_manager", "staff"]);
const CALENDAR_AUTHORS = new Set(["super_admin", "director", "principal", "administrator", "academic_coordinator", "admission_coordinator", "activity_coordinator", "sports_discipline_coordinator", "teacher", "staff"]);

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}
function fail(condition, message) { if (condition) throw new HttpsError("invalid-argument", message); }
function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z"));
}
async function actorFor(request) {
  if (!request.auth || !request.auth.uid) throw new HttpsError("unauthenticated", "Please sign in.");
  const snap = await db.collection("users").doc(request.auth.uid).get();
  if (!snap.exists) throw new HttpsError("permission-denied", "Your school profile is missing.");
  const profile = snap.data() || {};
  if (profile.status !== "active" || String(profile.email || "").toLowerCase() !== String(request.auth.token.email || "").toLowerCase()) {
    throw new HttpsError("permission-denied", "Your school profile is not active or does not match your Google account.");
  }
  return { uid: request.auth.uid, email: request.auth.token.email || "", role: String(profile.role || "").toLowerCase(), profile };
}
function requireRole(actor, roles) {
  if (!roles.has(actor.role)) throw new HttpsError("permission-denied", "Your role cannot perform this action.");
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
    if (task.assigneeUid !== actor.uid) requireRole(actor, LEADERS);
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
  const audience = Array.isArray(data.audience) ? [...new Set(data.audience.map(x => clean(x, 80)).filter(Boolean))] : [];
  fail(!title || !body || !audience.length || audience.length > 100, "Provide a title, message and 1–100 audience groups.");
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
  fail(!noticeId || !["approve", "reject"].includes(decision), "Select a notice and approve or reject it.");
  const ref = db.collection("schoolNotices").doc(noticeId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Notice not found.");
    const notice = snap.data();
    if (notice.status !== "pending_approval") throw new HttpsError("failed-precondition", "Only pending notices can be reviewed.");
    if (notice.authorUid === actor.uid) throw new HttpsError("permission-denied", "Authors cannot approve their own notices.");
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
  const audience = Array.isArray(data.audience) ? [...new Set(data.audience.map(x => clean(x, 80)).filter(Boolean))] : [];
  fail(!audience.length || audience.length > 100, "Choose 1–100 audience groups for this event.");
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
  fail(!eventId || !["approve", "reject"].includes(decision), "Select an event and approve or reject it.");
  const ref = db.collection("schoolCalendarEvents").doc(eventId);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Calendar event not found.");
    const event = snap.data();
    if (event.status !== "pending_approval") throw new HttpsError("failed-precondition", "Only pending events can be reviewed.");
    if (event.createdByUid === actor.uid) throw new HttpsError("permission-denied", "Authors cannot approve their own events.");
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
    authorRole: x.authorRole || "", status: x.status || "",
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
    status: x.status || "", createdAt: dateValue(x.createdAt),
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

