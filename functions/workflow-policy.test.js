"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const policy = require("./workflow-policy");

test("active identity requires active status and matching normalized email", () => {
  assert.equal(policy.isActiveProfile(
    { status: "active", email: "Teacher@BalJyoti.com" },
    "teacher@baljyoti.com"
  ), true);
  assert.equal(policy.isActiveProfile(
    { status: "pending", email: "teacher@baljyoti.com" },
    "teacher@baljyoti.com"
  ), false);
  assert.equal(policy.isActiveProfile(
    { status: "active", email: "other@baljyoti.com" },
    "teacher@baljyoti.com"
  ), false);
  assert.equal(policy.isActiveProfile(null, "teacher@baljyoti.com"), false);
});

test("role matrix separates task leadership, notice authors, calendar authors and reviewers", () => {
  assert.equal(policy.hasRole("teacher", policy.LEADER_ROLES), false);
  assert.equal(policy.hasRole("principal", policy.LEADER_ROLES), true);
  assert.equal(policy.hasRole("accountant", policy.NOTICE_AUTHOR_ROLES), true);
  assert.equal(policy.hasRole("accountant", policy.CALENDAR_AUTHOR_ROLES), false);
  assert.equal(policy.hasRole("administrator", policy.REVIEWER_ROLES), false);
  assert.equal(policy.hasRole("director", policy.REVIEWER_ROLES), true);
  assert.equal(policy.hasRole("super_admin", policy.REVIEWER_ROLES), true);
});

test("task status changes are limited to the assignee or a leadership role", () => {
  assert.equal(policy.canUpdateTask("teacher-a", "teacher-a", "teacher"), true);
  assert.equal(policy.canUpdateTask("teacher-b", "teacher-a", "teacher"), false);
  assert.equal(policy.canUpdateTask("principal-a", "teacher-a", "principal"), true);
});

test("reviewers cannot review their own submission and non-reviewer roles cannot review", () => {
  assert.equal(policy.canReviewSubmission("principal-a", "teacher-a", "principal"), true);
  assert.equal(policy.canReviewSubmission("teacher-a", "teacher-a", "principal"), false);
  assert.equal(policy.canReviewSubmission("teacher-b", "teacher-a", "teacher"), false);
  assert.equal(policy.canReviewSubmission("admin-a", "teacher-a", "administrator"), false);
});

test("only the original author can resubmit a rejected item", () => {
  assert.equal(policy.canResubmitSubmission("teacher-a", "teacher-a", "rejected"), true);
  assert.equal(policy.canResubmitSubmission("teacher-b", "teacher-a", "rejected"), false);
  assert.equal(policy.canResubmitSubmission("teacher-a", "teacher-a", "pending_approval"), false);
  assert.equal(policy.canResubmitSubmission("teacher-a", "teacher-a", "published"), false);
});
