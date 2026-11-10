# Bal Jyoti School OS — Connected School Data Blueprint

## Academic structure
Draft academic year 2026–27: 1 April 2026–31 March 2027. Class levels: Pre-Nursery, Nursery, LKG, UKG and Classes I–XII. Class XIII is included as a configurable custom level, disabled pending school approval; it is not assumed to be a standard CBSE grade. Sections are configurable; Section A is a suggested starter only. Subject offerings are configured by class and year.

## Student profile
Identity: student ID, admission number, name, preferred name, date of birth, gender, photo reference. Academic: year, class, section, roll number, admission date, previous school, status. Family: parent IDs, primary guardian, emergency contact, verified parent-child links. Services: address, transport link, house, language preference, document references and consent status. Sensitive health alerts, learning support notes and discipline records must be separately secured.

## Employee profile
Identity: employee ID/code, name, official email, mobile, photo reference. Employment: type, department, designation, system role, reporting manager, joining date and status. Academic allocation: qualifications, experience, subjects, assigned class/section IDs and coordinator scopes. Salary, bank, government ID and medical/leave documents must be separately secured for HR-only access.

## Connected collections
- users/{uid}: authentication identity, approved role and status.
- staffRecords/{employeeId}; students/{studentId}; parents/{parentId}; parentStudentLinks/{linkId}.
- academicYears/{yearId}; classes/{classId}; sections/{sectionId}; subjects/{subjectId}.
- teacherAssignments/{assignmentId}: teacher + class + section + subject + year.
- coordinatorAssignments/{assignmentId}: coordinator + scope + effective dates.
- academicCalendar/{eventId}; timetables/{entryId}; activityAssignments/{activityId}; tasks/{taskId}; auditLogs/{logId}.

## Role and activity model
Role responsibility templates and activity types are in app/assets/school-master-data.js. They are templates, not actual employee allocations. Each person must have an approved identity, role, reporting line and scope. Each activity/task must have an owner, reviewer, due date, status and linked class/department where applicable.

## Security and rollout
Current firestore.rules intentionally denies all operational collections. Do not deploy permissive rules. The new Super Admin setup page writes only system/schoolMasterData in staging; it does not create real student/employee records. The existing planner remains demo/local data until collection-specific rules and tested CRUD are implemented. Import actual records only from a school-approved source with verification, consent and rollback.

Recommended sequence: install staging blueprint; confirm classes/sections/subjects and Class XIII status; import verified employee records; import verified students and parent links; assign teachers/coordinators; publish timetable/calendar; enable activities/tasks; complete positive and negative access tests; only then approve operational Firestore rules.
