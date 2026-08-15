// AARIKA Admission domain model
// Foundation only: validation and persistence will be wired to Firestore in the next implementation pass.

export const ADMISSION_STATUS = Object.freeze({
  ENQUIRY: "ENQUIRY",
  APPLIED: "APPLIED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  ENROLLED: "ENROLLED"
});

export const ADMISSION_SOURCES = Object.freeze({
  WALK_IN: "WALK_IN",
  WEBSITE: "WEBSITE",
  REFERRAL: "REFERRAL",
  PHONE: "PHONE",
  OTHER: "OTHER"
});

export function createAdmission(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    academicSessionId: data.academicSessionId || null,
    applicationNumber: data.applicationNumber || null,
    status: data.status || ADMISSION_STATUS.ENQUIRY,
    source: data.source || ADMISSION_SOURCES.OTHER,
    student: {
      firstName: data.student?.firstName || "",
      middleName: data.student?.middleName || "",
      lastName: data.student?.lastName || "",
      dateOfBirth: data.student?.dateOfBirth || null,
      gender: data.student?.gender || "",
      classApplied: data.student?.classApplied || null
    },
    parent: {
      name: data.parent?.name || "",
      relationship: data.parent?.relationship || "",
      mobile: data.parent?.mobile || "",
      email: data.parent?.email || ""
    },
    documents: data.documents || [],
    notes: data.notes || "",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

export function validateAdmission(admission) {
  const errors = [];
  if (!admission?.schoolId) errors.push("schoolId is required");
  if (!admission?.academicSessionId) errors.push("academicSessionId is required");
  if (!admission?.student?.firstName) errors.push("student first name is required");
  if (!admission?.student?.dateOfBirth) errors.push("student date of birth is required");
  if (!admission?.parent?.name) errors.push("parent name is required");
  if (!admission?.parent?.mobile) errors.push("parent mobile is required");
  return { valid: errors.length === 0, errors };
}
