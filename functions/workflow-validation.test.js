"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  cleanText,
  isValidDate,
  normalizeAudience,
  hasValidAudience,
  validRejectionReason
} = require("./workflow-validation");

test("cleanText trims, collapses whitespace and enforces the limit", () => {
  assert.equal(cleanText("  School   notice\n today  ", 40), "School notice today");
  assert.equal(cleanText("abcdef", 3), "abc");
  assert.equal(cleanText(null, 20), "");
});

test("isValidDate accepts real ISO calendar dates only", () => {
  assert.equal(isValidDate("2024-02-29"), true);
  assert.equal(isValidDate("2025-02-29"), false);
  assert.equal(isValidDate("2026-13-01"), false);
  assert.equal(isValidDate("2026-04-31"), false);
  assert.equal(isValidDate("11/11/2026"), false);
});

test("audience normalization removes duplicates and unsupported values are rejected", () => {
  assert.deepEqual(normalizeAudience(["staff", "staff", " parents "]), ["staff", "parents"]);
  assert.equal(hasValidAudience(["all_school", "staff"]), true);
  assert.equal(hasValidAudience(["unknown_group"]), false);
  assert.equal(hasValidAudience([]), false);
  assert.equal(hasValidAudience(["staff", "students", "parents", "all_school", "staff"]), true);
});

test("rejection requires a meaningful reason; approval does not", () => {
  assert.equal(validRejectionReason("approve", ""), true);
  assert.equal(validRejectionReason("reject", "No."), true);
  assert.equal(validRejectionReason("reject", "  "), false);
  assert.equal(validRejectionReason("reject", "OK"), false);
});
