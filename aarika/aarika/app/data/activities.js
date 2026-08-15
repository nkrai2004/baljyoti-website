// AARIKA Activity domain model
// Foundation for student and school activities.

export const ACTIVITY_TYPES = Object.freeze({
  ACADEMIC: "ACADEMIC",
  SPORTS: "SPORTS",
  CULTURAL: "CULTURAL",
  CLUB: "CLUB",
  COMPETITION: "COMPETITION",
  EVENT: "EVENT",
  COMMUNITY: "COMMUNITY",
  OTHER: "OTHER"
});

export const ACTIVITY_STATUS = Object.freeze({
  DRAFT: "DRAFT",
  PLANNED: "PLANNED",
  OPEN: "OPEN",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
});

export function createActivity(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    academicSessionId: data.academicSessionId || null,
    title: data.title || "",
    description: data.description || "",
    type: data.type || ACTIVITY_TYPES.OTHER,
    status: data.status || ACTIVITY_STATUS.DRAFT,
    startAt: data.startAt || null,
    endAt: data.endAt || null,
    venue: data.venue || "",
    coordinatorId: data.coordinatorId || null,
    participantIds: Array.isArray(data.participantIds) ? data.participantIds : [],
    classSectionIds: Array.isArray(data.classSectionIds) ? data.classSectionIds : [],
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    notes: data.notes || "",
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

export function validateActivity(activity) {
  const errors = [];
  if (!activity?.schoolId) errors.push("schoolId is required");
  if (!activity?.academicSessionId) errors.push("academicSessionId is required");
  if (!activity?.title) errors.push("title is required");
  if (!activity?.startAt) errors.push("startAt is required");
  if (!activity?.coordinatorId) errors.push("coordinatorId is required");
  return { valid: errors.length === 0, errors };
}
