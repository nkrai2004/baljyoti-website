// AARIKA Academic domain foundation

export const ACADEMIC_STATUS = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
});

export const ASSESSMENT_TYPES = Object.freeze({
  FORMATIVE: "FORMATIVE",
  SUMMATIVE: "SUMMATIVE",
  PROJECT: "PROJECT",
  PRACTICAL: "PRACTICAL"
});

export function createAcademicSession(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    name: data.name || "",
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    status: data.status || ACADEMIC_STATUS.ACTIVE
  };
}

export function createSubject(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    name: data.name || "",
    code: data.code || "",
    classIds: data.classIds || [],
    teacherIds: data.teacherIds || [],
    status: data.status || ACADEMIC_STATUS.ACTIVE
  };
}

export function createClassSection(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    academicSessionId: data.academicSessionId || null,
    className: data.className || "",
    sectionName: data.sectionName || "",
    classTeacherId: data.classTeacherId || null,
    room: data.room || "",
    studentIds: data.studentIds || [],
    status: data.status || ACADEMIC_STATUS.ACTIVE
  };
}

export function createAssessment(data = {}) {
  return {
    id: data.id || null,
    schoolId: data.schoolId || null,
    academicSessionId: data.academicSessionId || null,
    classSectionId: data.classSectionId || null,
    subjectId: data.subjectId || null,
    title: data.title || "",
    type: data.type || ASSESSMENT_TYPES.FORMATIVE,
    assessmentDate: data.assessmentDate || null,
    maxMarks: Number.isFinite(data.maxMarks) ? data.maxMarks : 0,
    status: data.status || ACADEMIC_STATUS.ACTIVE
  };
}

export function validateAcademicEntity(entity, type) {
  const errors = [];
  if (!entity?.schoolId) errors.push("schoolId is required");

  if (type === "session") {
    if (!entity.name) errors.push("session name is required");
    if (!entity.startDate) errors.push("start date is required");
    if (!entity.endDate) errors.push("end date is required");
  }

  if (type === "subject" && !entity.name) {
    errors.push("subject name is required");
  }

  if (type === "classSection") {
    if (!entity.academicSessionId) errors.push("academicSessionId is required");
    if (!entity.className) errors.push("class name is required");
    if (!entity.sectionName) errors.push("section name is required");
  }

  if (type === "assessment") {
    if (!entity.academicSessionId) errors.push("academicSessionId is required");
    if (!entity.classSectionId) errors.push("classSectionId is required");
    if (!entity.subjectId) errors.push("subjectId is required");
    if (!entity.title) errors.push("assessment title is required");
  }

  return { valid: errors.length === 0, errors };
}
