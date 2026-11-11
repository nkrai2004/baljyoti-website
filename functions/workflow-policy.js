"use strict";

const LEADER_ROLES = new Set(["super_admin", "director", "principal", "administrator"]);
const NOTICE_AUTHOR_ROLES = new Set([
  "super_admin", "director", "principal", "administrator",
  "academic_coordinator", "admission_coordinator", "activity_coordinator",
  "sports_discipline_coordinator", "teacher", "accountant", "hr_manager", "staff"
]);
const CALENDAR_AUTHOR_ROLES = new Set([
  "super_admin", "director", "principal", "administrator",
  "academic_coordinator", "admission_coordinator", "activity_coordinator",
  "sports_discipline_coordinator", "teacher", "staff"
]);
const REVIEWER_ROLES = new Set(["super_admin", "director", "principal"]);

function hasRole(role, allowedRoles) {
  return allowedRoles.has(String(role || "").toLowerCase());
}
function isActiveProfile(profile, tokenEmail) {
  return !!profile &&
    profile.status === "active" &&
    String(profile.email || "").trim().toLowerCase() ===
      String(tokenEmail || "").trim().toLowerCase();
}
function canUpdateTask(actorUid, assigneeUid, actorRole) {
  return actorUid === assigneeUid || hasRole(actorRole, LEADER_ROLES);
}
function canReviewSubmission(actorUid, authorUid, actorRole) {
  return hasRole(actorRole, REVIEWER_ROLES) && actorUid !== authorUid;
}
function canResubmitSubmission(actorUid, authorUid, status) {
  return !!actorUid && actorUid === authorUid && status === "rejected";
}

module.exports = {
  LEADER_ROLES,
  NOTICE_AUTHOR_ROLES,
  CALENDAR_AUTHOR_ROLES,
  REVIEWER_ROLES,
  hasRole,
  isActiveProfile,
  canUpdateTask,
  canReviewSubmission,
  canResubmitSubmission
};
