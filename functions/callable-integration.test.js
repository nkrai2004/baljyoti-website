"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const projectId = process.env.GCLOUD_PROJECT || "demo-baljyoti-school-os";
const region = "asia-south1";
const functionsHost = process.env.FUNCTIONS_EMULATOR_HOST || "127.0.0.1:5001";
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
const app = initializeApp({ projectId }, "callable-integration-tests");
const db = getFirestore(app);
const auth = getAuth(app);
const actors = {};

async function createActor(key, role, accountType = "staff") {
  const email = key + "@example.test";
  const created = await auth.createUser({
    email, password: "Test-password-123!", emailVerified: true, displayName: key
  });
  await db.collection("users").doc(created.uid).set({
    uid: created.uid, email, fullName: key, role, status: "active", accountType
  });
  const signUp = await fetch(
    "http://" + authHost + "/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: "Test-password-123!", returnSecureToken: true })
    }
  );
  const authBody = await signUp.json();
  assert.equal(signUp.ok, true, JSON.stringify(authBody));
  actors[key] = { uid: created.uid, email, token: authBody.idToken, role };
  return actors[key];
}

async function call(name, actor, data = {}) {
  const response = await fetch(
    "http://" + functionsHost + "/" + projectId + "/" + region + "/" + name,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + actor.token
      },
      body: JSON.stringify({ data })
    }
  );
  const body = await response.json();
  if (!response.ok || body.error) {
    const error = new Error(body.error?.message || "Callable request failed");
    error.code = body.error?.status || response.status;
    throw error;
  }
  return body.result;
}

function expectCode(expected, action) {
  return assert.rejects(action, error => {
    assert.equal(error.code, expected, error.message);
    return true;
  });
}

async function record(collection, id) {
  const snap = await db.collection(collection).doc(id).get();
  return snap.exists ? snap.data() : null;
}

test.before(async () => {
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, "Firestore emulator must be running");
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, "Auth emulator must be running");
  await createActor("teacher-a", "teacher");
  await createActor("teacher-b", "teacher");
  await createActor("principal-a", "principal");
  await createActor("director-a", "director");
  await createActor("admin-a", "administrator");
  await createActor("superadmin-a", "super_admin");
  await createActor("parent-a", "parent", "parent");

  await db.collection("schoolTasks").doc("task-for-a").set({
    title: "Synthetic assigned task", assigneeUid: actors["teacher-a"].uid,
    status: "open", priority: "normal"
  });
  await db.collection("schoolNotices").doc("rejected-notice-a").set({
    title: "Rejected synthetic notice", body: "Needs changes",
    audience: ["staff"], authorUid: actors["teacher-a"].uid,
    authorRole: "teacher", status: "rejected", reviewReason: "Please revise",
    resubmissionCount: 0
  });
  await db.collection("schoolNotices").doc("pending-notice-a").set({
    title: "Pending synthetic notice", body: "Awaiting review",
    audience: ["staff"], authorUid: actors["teacher-a"].uid,
    authorRole: "teacher", status: "pending_approval"
  });
  await db.collection("schoolCalendarEvents").doc("rejected-event-a").set({
    title: "Rejected synthetic event", description: "Needs changes",
    startDate: "2026-12-01", endDate: "2026-12-01",
    audience: ["staff"], createdByUid: actors["teacher-a"].uid,
    createdByRole: "teacher", status: "rejected", reviewReason: "Please revise",
    resubmissionCount: 0
  });
});

test.after(async () => {
  await app.delete();
});

test("callables reject unauthenticated requests", async () => {
  const response = await fetch(
    "http://" + functionsHost + "/" + projectId + "/" + region + "/submitSchoolNotice",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: { title: "No auth", body: "No auth", audience: ["staff"] } })
    }
  );
  assert.equal(response.ok, false);
});

test("teacher can submit notice; reviewer must give reason to reject; original author alone can resubmit", async () => {
  const author = actors["teacher-a"];
  const reviewer = actors["principal-a"];
  const submitted = await call("submitSchoolNotice", author, {
    title: "Synthetic notice", body: "Test workflow", audience: ["staff"]
  });
  assert.equal(submitted.status, "pending_approval");

  await expectCode("INVALID_ARGUMENT", () =>
    call("reviewSchoolNotice", reviewer, {
      noticeId: submitted.noticeId, decision: "reject", reason: " "
    })
  );
  const rejected = await call("reviewSchoolNotice", reviewer, {
    noticeId: submitted.noticeId, decision: "reject", reason: "Please add date"
  });
  assert.equal(rejected.status, "rejected");
  assert.equal((await record("schoolNotices", submitted.noticeId)).reviewReason, "Please add date");

  await expectCode("PERMISSION_DENIED", () =>
    call("resubmitRejectedSchoolNotice", actors["teacher-b"], {
      noticeId: submitted.noticeId, title: "Hijack", body: "No", audience: ["staff"]
    })
  );
  const resubmitted = await call("resubmitRejectedSchoolNotice", author, {
    noticeId: submitted.noticeId, title: "Revised synthetic notice",
    body: "Updated text", audience: ["staff"]
  });
  assert.equal(resubmitted.status, "pending_approval");
  const updated = await record("schoolNotices", submitted.noticeId);
  assert.equal(updated.reviewReason, undefined);
  assert.equal(updated.resubmissionCount, 1);
  await expectCode("FAILED_PRECONDITION", () =>
    call("resubmitRejectedSchoolNotice", author, {
      noticeId: submitted.noticeId, title: "Again", body: "Again", audience: ["staff"]
    })
  );
});

test("only reviewer roles can review, and authors cannot review their own notice", async () => {
  const own = await call("submitSchoolNotice", actors["principal-a"], {
    title: "Principal's own notice", body: "Self review must fail", audience: ["staff"]
  });
  await expectCode("PERMISSION_DENIED", () =>
    call("reviewSchoolNotice", actors["principal-a"], {
      noticeId: own.noticeId, decision: "approve"
    })
  );
  await expectCode("PERMISSION_DENIED", () =>
    call("reviewSchoolNotice", actors["teacher-b"], {
      noticeId: own.noticeId, decision: "approve"
    })
  );
  const approved = await call("reviewSchoolNotice", actors["director-a"], {
    noticeId: own.noticeId, decision: "approve"
  });
  assert.equal(approved.status, "published");
});

test("calendar event review and resubmission enforce reason, owner and rejected status", async () => {
  const author = actors["teacher-a"];
  const reviewer = actors["director-a"];
  const submitted = await call("submitSchoolCalendarEvent", author, {
    title: "Synthetic event", description: "Integration test",
    startDate: "2026-12-10", endDate: "2026-12-11",
    audience: ["staff"], category: "school"
  });
  await expectCode("INVALID_ARGUMENT", () =>
    call("reviewSchoolCalendarEvent", reviewer, {
      eventId: submitted.eventId, decision: "reject", reason: "x"
    })
  );
  const rejected = await call("reviewSchoolCalendarEvent", reviewer, {
    eventId: submitted.eventId, decision: "reject", reason: "Please correct date"
  });
  assert.equal(rejected.status, "rejected");
  await expectCode("PERMISSION_DENIED", () =>
    call("resubmitRejectedSchoolCalendarEvent", actors["teacher-b"], {
      eventId: submitted.eventId, title: "Wrong owner", startDate: "2026-12-10",
      endDate: "2026-12-10", audience: ["staff"]
    })
  );
  const resubmitted = await call("resubmitRejectedSchoolCalendarEvent", author, {
    eventId: submitted.eventId, title: "Revised event", description: "Corrected",
    startDate: "2026-12-12", endDate: "2026-12-12", audience: ["staff"]
  });
  assert.equal(resubmitted.status, "pending_approval");
  const updated = await record("schoolCalendarEvents", submitted.eventId);
  assert.equal(updated.reviewReason, undefined);
  assert.equal(updated.resubmissionCount, 1);
  await expectCode("FAILED_PRECONDITION", () =>
    call("resubmitRejectedSchoolCalendarEvent", author, {
      eventId: submitted.eventId, title: "Again", startDate: "2026-12-12",
      endDate: "2026-12-12", audience: ["staff"]
    })
  );
});

test("calendar authors cannot review their own event and teachers cannot review", async () => {
  const own = await call("submitSchoolCalendarEvent", actors["principal-a"], {
    title: "Principal event", description: "Self review",
    startDate: "2026-12-20", endDate: "2026-12-20", audience: ["staff"]
  });
  await expectCode("PERMISSION_DENIED", () =>
    call("reviewSchoolCalendarEvent", actors["principal-a"], {
      eventId: own.eventId, decision: "approve"
    })
  );
  await expectCode("PERMISSION_DENIED", () =>
    call("reviewSchoolCalendarEvent", actors["teacher-b"], {
      eventId: own.eventId, decision: "approve"
    })
  );
});

test("task creation is leadership-only and task updates are assignee-scoped", async () => {
  await expectCode("PERMISSION_DENIED", () =>
    call("createSchoolTask", actors["teacher-a"], {
      title: "Unauthorized task", assigneeUid: actors["teacher-a"].uid
    })
  );
  await expectCode("FAILED_PRECONDITION", () =>
    call("createSchoolTask", actors["principal-a"], {
      title: "Task to parent", assigneeUid: actors["parent-a"].uid
    })
  );
  const created = await call("createSchoolTask", actors["principal-a"], {
    title: "Synthetic assigned task", description: "Callable test",
    assigneeUid: actors["teacher-a"].uid, dueDate: "2026-12-15", priority: "high"
  });
  assert.equal(created.status, "open");
  const updated = await call("updateSchoolTaskStatus", actors["teacher-a"], {
    taskId: created.taskId, status: "in_progress"
  });
  assert.equal(updated.status, "in_progress");
  await expectCode("PERMISSION_DENIED", () =>
    call("updateSchoolTaskStatus", actors["teacher-b"], {
      taskId: created.taskId, status: "completed"
    })
  );
  const privilegedUpdate = await call("updateSchoolTaskStatus", actors["principal-a"], {
    taskId: created.taskId, status: "completed"
  });
  assert.equal(privilegedUpdate.status, "completed");
});

test("scoped list callables return only the caller's work and management queues are role-gated", async () => {
  const mine = await call("listMySchoolTasks", actors["teacher-a"]);
  assert.ok(mine.items.some(item => item.assigneeUid === actors["teacher-a"].uid));
  assert.ok(mine.items.every(item => item.assigneeUid === actors["teacher-a"].uid));
  await expectCode("PERMISSION_DENIED", () =>
    call("listPendingSchoolNotices", actors["teacher-b"])
  );
  const queue = await call("listPendingSchoolNotices", actors["principal-a"]);
  assert.ok(queue.items.every(item => item.authorUid !== actors["principal-a"].uid));
  const ownHistory = await call("listMySchoolNoticeSubmissions", actors["teacher-a"]);
  assert.ok(ownHistory.items.every(item => item.authorUid === actors["teacher-a"].uid));
});

test("active profile and token email must match before callable access", async () => {
  await db.collection("users").doc(actors["teacher-b"].uid).update({
    email: "mismatch@example.test"
  });
  await expectCode("PERMISSION_DENIED", () =>
    call("listMySchoolTasks", actors["teacher-b"])
  );
});
