// AARIKA Administration domain model
// Operational foundation for school administration. Persistence, workflows,
// notifications and approvals will be connected to the platform services later.

export const ADMIN_RECORD_STATUS = Object.freeze({
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
});

export const ADMIN_RECORD_TYPES = Object.freeze({
  REQUEST: "REQUEST",
  TASK: "TASK",
  NOTICE: "NOTICE",
  ASSET: "ASSET",
  DOCUMENT: "DOCUMENT",
  APPROVAL: "APPROVAL"
});

export function createAdminRecord(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    type: data.type || ADMIN_RECORD_TYPES.REQUEST,
    title: data.title || "",
    description: data.description || "",
    status: data.status || ADMIN_RECORD_STATUS.OPEN,
    priority: data.priority || "NORMAL",
    category: data.category || "GENERAL",
    requestedBy: data.requestedBy || null,
    assignedTo: data.assignedTo || null,
    dueAt: data.dueAt || null,
    attachments: data.attachments || [],
    approval: data.approval || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    completedAt: data.completedAt || null
  };
}

export function validateAdminRecord(record) {
  const errors = [];
  if (!record?.schoolId) errors.push("schoolId is required");
  if (!record?.title) errors.push("title is required");
  if (!record?.requestedBy) errors.push("requestedBy is required");
  if (!Object.values(ADMIN_RECORD_STATUS).includes(record?.status)) {
    errors.push("invalid status");
  }
  if (!Object.values(ADMIN_RECORD_TYPES).includes(record?.type)) {
    errors.push("invalid record type");
  }
  return { valid: errors.length === 0, errors };
}
