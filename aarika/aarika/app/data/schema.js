// AARIKA data model foundation
// Firestore collections are tenant-aware. Every school-owned record carries schoolId.

export const COLLECTIONS = Object.freeze({
  schools: "schools",
  users: "users",
  schoolSettings: "schoolSettings"
});

export const SCHOOL_FIELDS = Object.freeze([
  "name",
  "code",
  "status",
  "address",
  "contact",
  "timezone",
  "createdAt",
  "updatedAt"
]);

export const USER_FIELDS = Object.freeze([
  "uid",
  "email",
  "displayName",
  "photoURL",
  "schoolId",
  "roleId",
  "status",
  "createdAt",
  "updatedAt"
]);

export function schoolRef(db, schoolId) {
  if (!schoolId) throw new Error("schoolId is required");
  return { collection: COLLECTIONS.schools, id: schoolId, db };
}

export function userRef(db, uid) {
  if (!uid) throw new Error("uid is required");
  return { collection: COLLECTIONS.users, id: uid, db };
}
