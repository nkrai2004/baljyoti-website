"use strict";

const REQUESTED_AUDIENCES = new Set(["all_school", "staff", "students", "parents"]);

function cleanText(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function normalizeAudience(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => cleanText(item, 80)).filter(Boolean))];
}

function hasValidAudience(value) {
  const groups = normalizeAudience(value);
  return groups.length > 0 && groups.length <= REQUESTED_AUDIENCES.size &&
    groups.every(group => REQUESTED_AUDIENCES.has(group));
}

function validRejectionReason(decision, reason) {
  return decision !== "reject" || cleanText(reason, 500).length >= 3;
}

module.exports = {
  REQUESTED_AUDIENCES,
  cleanText,
  isValidDate,
  normalizeAudience,
  hasValidAudience,
  validRejectionReason
};
