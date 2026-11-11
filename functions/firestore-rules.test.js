"use strict";

const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} = require("@firebase/rules-unit-testing");
const {
  doc, getDoc, setDoc, getDocs, collection
} = require("firebase/firestore");

const projectId = "demo-baljyoti-school-os";
let testEnv;

test.before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync(path.join(__dirname, "../firestore.rules"), "utf8")
    }
  });
  await testEnv.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, "users", "teacher-1"), {
      uid: "teacher-1", email: "teacher@baljyoti.com",
      role: "teacher", status: "active", accountType: "staff"
    });
    await setDoc(doc(db, "users", "teacher-2"), {
      uid: "teacher-2", email: "teacher2@baljyoti.com",
      role: "teacher", status: "active", accountType: "staff"
    });
    await setDoc(doc(db, "users", "admin-1"), {
      uid: "admin-1", email: "admin@baljyoti.com",
      role: "super_admin", status: "active", accountType: "staff"
    });
    await setDoc(doc(db, "system", "moduleRegistry"), { modules: [] });
    await setDoc(doc(db, "schoolTasks", "synthetic-task"), {
      title: "Synthetic task", assigneeUid: "teacher-1"
    });
    await setDoc(doc(db, "userModuleOverrides", "teacher-1"), {
      userId: "teacher-1", allow: ["attendance"], deny: []
    });
  });
});

test.after(async () => {
  if (testEnv) await testEnv.cleanup();
});

test("active user can read own profile but not another user's profile", async () => {
  const db = testEnv.authenticatedContext("teacher-1", {
    email: "teacher@baljyoti.com"
  }).firestore();
  await assertSucceeds(getDoc(doc(db, "users", "teacher-1")));
  await assertFails(getDoc(doc(db, "users", "teacher-2")));
});

test("only Super Admin can list user profiles", async () => {
  const teacherDb = testEnv.authenticatedContext("teacher-1", {
    email: "teacher@baljyoti.com"
  }).firestore();
  const adminDb = testEnv.authenticatedContext("admin-1", {
    email: "admin@baljyoti.com"
  }).firestore();
  await assertFails(getDocs(collection(teacherDb, "users")));
  await assertSucceeds(getDocs(collection(adminDb, "users")));
});

test("operational school records remain closed to browser reads and writes", async () => {
  const db = testEnv.authenticatedContext("teacher-1", {
    email: "teacher@baljyoti.com"
  }).firestore();
  await assertFails(getDoc(doc(db, "schoolTasks", "synthetic-task")));
  await assertFails(setDoc(doc(db, "schoolTasks", "client-write"), {
    title: "Must be denied", assigneeUid: "teacher-1"
  }));
  await assertFails(getDoc(doc(db, "schoolNotices", "any-notice")));
  await assertFails(getDoc(doc(db, "schoolCalendarEvents", "any-event")));
});

test("module override is readable by its owner but not writable by clients", async () => {
  const ownerDb = testEnv.authenticatedContext("teacher-1", {
    email: "teacher@baljyoti.com"
  }).firestore();
  const otherDb = testEnv.authenticatedContext("teacher-2", {
    email: "teacher2@baljyoti.com"
  }).firestore();
  const adminDb = testEnv.authenticatedContext("admin-1", {
    email: "admin@baljyoti.com"
  }).firestore();
  await assertSucceeds(getDoc(doc(ownerDb, "userModuleOverrides", "teacher-1")));
  await assertFails(getDoc(doc(otherDb, "userModuleOverrides", "teacher-1")));
  await assertFails(setDoc(doc(ownerDb, "userModuleOverrides", "teacher-1"), {
    allow: ["fees"], deny: []
  }));
  await assertSucceeds(getDoc(doc(adminDb, "userModuleOverrides", "teacher-1")));
});

test("inactive or email-mismatched profiles cannot use active-user reads", async () => {
  const mismatchedDb = testEnv.authenticatedContext("teacher-1", {
    email: "different@baljyoti.com"
  }).firestore();
  await assertFails(getDoc(doc(mismatchedDb, "system", "moduleRegistry")));
});
