"use strict";
/* Bal Jyoti School OS — logical database blueprint v1.1.
 * Metadata only. Does not create collections or write records.
 * Firestore operational collections remain disabled until reviewed security rules are deployed.
 */
window.BJ_DATABASE_SCHEMA={
 version:"1.1",
 identity:{userCollection:"users",employeeCollection:"staffRecords",studentCollection:"students",principle:"One employee/student/parent master record; module records reference stable IDs, never duplicate profiles."},
 collections:{
  academicYears:{key:"academicYearId",fields:["academicYearId","name","startDate","endDate","status","isCurrent","createdAt","updatedAt"]},
  classes:{key:"classId",fields:["classId","academicYearId","className","classOrder","stage","status"]},
  sections:{key:"sectionId",fields:["sectionId","academicYearId","classId","sectionName","capacity","classTeacherEmployeeId","status"]},
  subjects:{key:"subjectId",fields:["subjectId","subjectCode","subjectName","subjectGroup","applicableClassIds","isCore","status"]},
  classSubjectOfferings:{key:"offeringId",fields:["offeringId","academicYearId","classId","sectionId","subjectId","weeklyPeriods","isCore","status"]},
  employees:{key:"employeeId",collection:"staffRecords",fields:["employeeId","employeeCode","userUid","fullName","officialEmail","mobile","departmentId","designation","employmentType","joiningDate","employmentStatus","reportingToEmployeeId","qualificationSummary","experienceYears","primarySystemRole","subjects","assignedClassSectionIds","additionalResponsibilities","workLocation","createdAt","updatedAt","createdByUid"]},
  employeeResponsibilities:{key:"responsibilityAssignmentId",fields:["responsibilityAssignmentId","employeeId","responsibilityType","scopeType","scopeIds","coordinatorEmployeeId","assignedByUid","effectiveFrom","effectiveTo","status","createdAt","updatedAt"]},
  students:{key:"studentId",fields:["studentId","admissionNumber","fullName","preferredName","dateOfBirth","gender","academicYearId","classId","sectionId","rollNumber","admissionDate","studentStatus","primaryGuardianId","parentIds","emergencyContactName","emergencyContactPhone","address","transportLinkId","houseId","documentRefs","consentStatus","createdAt","updatedAt","createdByUid"]},
  studentPrivate:{key:"studentId",fields:["studentId","emergencyHealthAlertRef","learningSupportNotesRef","disciplineRestrictedRef"],security:"Restricted; separate from ordinary student profile."},
  parents:{key:"parentId",fields:["parentId","fullName","email","mobile","address","status","createdAt","updatedAt"]},
  parentStudentLinks:{key:"linkId",fields:["linkId","parentId","studentId","relationship","isPrimaryGuardian","verificationStatus","verifiedByUid","verifiedAt"]},
  activities:{key:"activityId",fields:["activityId","activityName","category","description","applicableClassIds","defaultSessionsPerWeek","status"]},
  teacherAssignments:{key:"teacherAssignmentId",fields:["teacherAssignmentId","academicYearId","employeeId","userUid","classId","sectionId","subjectId","offeringId","weeklyPeriods","periodSlots","isClassTeacher","isPrimaryTeacher","coTeacherEmployeeIds","coordinatorEmployeeId","effectiveFrom","effectiveTo","approvalStatus","approvedByUid","createdAt","updatedAt"]},
  activityAssignments:{key:"activityAssignmentId",fields:["activityAssignmentId","academicYearId","employeeId","activityId","classId","sectionId","activityType","weeklySessions","periodSlots","dutyScope","coordinatorEmployeeId","effectiveFrom","effectiveTo","approvalStatus","approvedByUid","createdAt","updatedAt"]},
  timetables:{key:"timetableEntryId",fields:["timetableEntryId","academicYearId","classId","sectionId","dayOfWeek","periodId","startTime","endTime","subjectId","activityId","teacherEmployeeId","roomId","status","approvedByUid"]},
  workloadRules:{key:"workloadRuleId",fields:["workloadRuleId","employeeId","academicYearId","maxWeeklyTeachingPeriods","maxWeeklyActivitySessions","nonTeachingDuties","effectiveFrom","effectiveTo","approvedByUid"]},
  academicCalendar:{key:"calendarEventId",fields:["calendarEventId","academicYearId","title","category","startDate","endDate","audienceClassIds","ownerEmployeeId","coordinatorEmployeeId","status"]},
  attendance:{key:"attendanceId",fields:["attendanceId","date","academicYearId","classId","sectionId","studentId","attendanceStatus","markedByUid","markedAt"]},
  schoolTasks:{key:"taskId",fields:["taskId","title","description","assigneeUid","assigneeName","assignedByUid","assignedByRole","dueDate","priority","status","createdAt","updatedAt","lastUpdatedByUid"],security:"Server callable writes only; reads remain closed pending record-level access design."},
  schoolNotices:{key:"noticeId",fields:["noticeId","title","body","audience","category","authorUid","authorRole","status","reviewedByUid","reviewedByRole","reviewReason","reviewedAt","createdAt","updatedAt"],security:"Server callable writes only; published audience reads remain closed pending audience enforcement."},
  schoolCalendarEvents:{key:"eventId",fields:["eventId","title","description","startDate","endDate","audience","category","location","createdByUid","createdByRole","status","reviewedByUid","reviewedByRole","reviewReason","reviewedAt","createdAt","updatedAt"],security:"Server callable writes only; published audience reads remain closed pending audience enforcement."},
  auditLogs:{key:"auditLogId",fields:["auditLogId","actorUid","actorEmail","action","collection","recordId","timestamp","changeSummary","requestId","assigneeUid","priority","audienceCount","startDate","endDate","previousStatus","newStatus"]}
 },
 references:{employeeId:"staffRecords.employeeId",userUid:"users/{uid}",studentId:"students.studentId",parentId:"parents.parentId",classId:"classes.classId",sectionId:"sections.sectionId",subjectId:"subjects.subjectId",activityId:"activities.activityId",academicYearId:"academicYears.academicYearId"},
 constraints:[
  "Every employee profile has one stable employeeId and may link to one login UID.",
  "A teacher may have multiple subject, class, section and activity assignments.",
  "Primary login role is distinct from functional responsibility assignments.",
  "Teacher and class/section cannot have overlapping approved timetable slots.",
  "Parent-child access requires a verified parentStudentLinks record and record-level security.",
  "Student sensitive information and HR sensitive information are stored separately with stricter access.",
  "All operational writes require actor, timestamp and audit trail.",
  "Google Sheets is an approved bulk-entry/import/export interface, not the security authority or production database."
 ],
 sheetTabs:["Read Me","Academic Years","Classes & Sections","Subjects","Employees","Employee Responsibilities","Students","Parents","Parent-Student Links","Activities","Class Subject Offerings","Teacher Assignments","Activity Assignments","Timetable","Workload Rules","Data Dictionary"]
};
