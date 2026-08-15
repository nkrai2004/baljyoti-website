// AARIKA School Setup foundation
// Defines the canonical school structure used by downstream modules.

export const SCHOOL_SETUP_DEFAULTS = Object.freeze({
  status: "ACTIVE",
  defaultLanguage: "en-IN",
  supportedLanguages: ["en-IN", "hi-IN"],
  timezone: "Asia/Kolkata",
  academicSession: {
    name: "",
    startDate: "",
    endDate: ""
  },
  classes: [],
  sections: [],
  departments: [],
  settings: {
    attendance: { enabled: true },
    leave: { enabled: true },
    transport: { enabled: true },
    maintenance: { enabled: true },
    duties: { enabled: true }
  }
});

export function createSchoolSetup(input = {}) {
  return {
    ...SCHOOL_SETUP_DEFAULTS,
    ...input,
    academicSession: {
      ...SCHOOL_SETUP_DEFAULTS.academicSession,
      ...(input.academicSession || {})
    },
    settings: {
      ...SCHOOL_SETUP_DEFAULTS.settings,
      ...(input.settings || {})
    }
  };
}

export function validateSchoolSetup(school) {
  const errors = [];

  if (!school?.schoolId) errors.push("schoolId is required");
  if (!school?.name) errors.push("school name is required");
  if (!school?.academicSession?.name) errors.push("academic session is required");

  return {
    valid: errors.length === 0,
    errors
  };
}
