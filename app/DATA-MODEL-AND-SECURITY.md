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

## Flexible employee responsibility mapping
An employee has one primary authentication role in `users/{uid}.role` and may hold multiple additional functional assignments in `users/{uid}.additionalResponsibilities` and, after the employee directory is connected, `staffRecords/{employeeId}.responsibilityAssignments`. Examples: coordinator, admission counsellor, academic counsellor, administrative in-charge, class in-charge, examination in-charge, activity/event/house/transport/library/discipline in-charge. A teacher can retain Teacher as the primary role while holding these assignments. Functional assignments require an approved scope, assigning manager, effective dates and review status. They do not automatically grant additional module permissions; module access remains separately controlled by role/module grants and Firestore rules.

## Admission workflow
Dedicated Admissions workspace: enquiry capture, class applied for, source, assigned counsellor, follow-up date, status, campus visit, document checklist, application and admission outcome. Admission Team Coordinator allocates and reviews counsellors; Admission Counsellor handles assigned family follow-ups; Academic Counsellor or a teacher with an approved assignment supports class/academic fit conversations. The current admissions screen is a synthetic local-browser prototype only; no live parent/student data is stored.

## Teacher–class–subject–activity allocation
The academic allocation model must preserve these relationships:
- Class subject offerings define which subjects apply to each class/section and academic year, including core/elective status and weekly periods.
- Teacher assignments link an employee and optional user UID to the academic year, class, section, subject, weekly period count, actual period slots, primary/co-teacher status, class-teacher status, coordinator and approval dates.
- Activity assignments separately map teachers/in-charges to co-curricular activities (Art & Craft, Music, Dance, Sports/Physical Education, Yoga, Library/Reading, Life Skills, Assembly, House Activities) by class/section and sessions per week.
- Workload rules track assigned teaching periods plus non-teaching duties, so multiple roles do not hide workload or create timetable conflicts.
- Academic Coordinator oversees subject and timetable allocations; Activity Coordinator oversees co-curricular activity allocations; Principal approves the final timetable and any exceptions.
- A teacher can have multiple class/subject assignments and activity duties while retaining the Teacher primary role. Additional assignments (Class In-charge, Exam In-charge, Academic Counsellor, Admission Counsellor, etc.) remain separate from primary system role.
The Academic Planner now includes a demo allocation form. Its entries remain in local browser storage and are not operational Firestore records. Firestore security rules currently deny operational collections; do not enter real data until rules and record-level tests are approved.

## Assignment and workload validation (prototype stage)
The Academic Planner now captures a proposed weekday and period slot for each demo allocation. Before adding a slot it checks:
1. The same employee is not assigned to two different activities/subjects in the same weekday and period.
2. The same class/section is not assigned two different subjects/activities in the same weekday and period.
3. Weekly workload is summarised by allocated teacher and total weekly periods/sessions.
4. An allocation can be removed from the local demo list; all changes remain browser-local.

The live assignment service should use stable IDs rather than display names:
- employeeId and userUid for the assigned teacher;
- academicYearId, classId, sectionId and subjectId/activityId;
- dayOfWeek and periodId (or a start/end time range);
- weeklyPeriods or weeklySessions;
- assignmentType, coordinatorEmployeeId, approvalStatus, effective dates and audit fields.

Server-side validation must repeat all clash checks in a Firestore transaction or trusted backend. Client-side checks are usability aids only and cannot enforce school-wide uniqueness. Workload policy (maximum teaching periods, activity sessions, class duties and coordinator time) must be configured and approved by school management before any automatic overload warning becomes a formal restriction.

The Employee Directory is the current central profile editor for login-linked staff identity and employment/teaching summary fields. Do not duplicate employee records in each module. Once security rules are reviewed, synchronise approved staff profile data into staffRecords/{employeeId}; reference employeeId and userUid from academic, HR, activity and timetable assignments. Salary, bank, government ID and medical records must remain in separately secured HR-only data.

## Complete master-data database structure (v1.1)
The machine-readable logical schema is maintained in `app/assets/school-database-schema.js`. It is a blueprint only; it does not create Firestore collections or enable operational writes.

### Master entities
- **Academic:** academicYears, classes, sections, subjects, classSubjectOfferings.
- **People:** users (authentication/profile link), staffRecords (employees), students, parents, parentStudentLinks.
- **Responsibilities:** employeeResponsibilities, including responsibility type, scope, coordinator, assigning manager, effective dates and status.
- **Activities & allocation:** activities, teacherAssignments, activityAssignments, timetables, workloadRules.
- **School operations:** academicCalendar, attendance, auditLogs.
- **Restricted data:** student private records and HR-sensitive records are separated from ordinary profiles.

### Relationship rules
- EmployeeID is the stable employee key. User UID links the employee to Google sign-in. Do not create a separate employee copy in each module.
- StudentID, ParentID, ClassID, SectionID, SubjectID, ActivityID and AcademicYearID are stable references.
- A teacher may have multiple teacherAssignments and activityAssignments; a functional responsibility does not change the primary login role.
- Parent access requires a verified parentStudentLinks relationship.
- Approved timetable entries must not overlap for the same teacher or class/section.
- Every operational change must carry actor, timestamp and audit metadata.

### Google Sheets workflow
A blank workbook named **Bal Jyoti School Master Data Template** is supplied separately. It has tabs for Academic Years, Classes & Sections, Subjects, Employees, Employee Responsibilities, Students, Parents, Parent-Student Links, Activities, Class Subject Offerings, Teacher Assignments, Activity Assignments, Timetable, Workload Rules and Data Dictionary.

Recommended use:
1. Upload the workbook to the school's authorised Google Drive and open it with Google Sheets.
2. Give access only to designated data owners; avoid public or link-wide sharing.
3. Assign unique stable IDs and validate records before approval.
4. Use separate tabs for employee master data and each employee's subject/activity/responsibility assignments.
5. Keep restricted health, discipline, salary, bank, government ID and medical data out of the workbook.
6. Treat the sheet as a controlled staging/import-export tool. Firestore remains the system of record once operational security rules and import validation are approved.
7. Do not import bulk records into production until staging tests, role-based access tests, duplicate checks and audit logging are signed off.

No live Google Sheet has been created or connected from this environment. The supplied workbook is compatible with Google Sheets and can be uploaded by an authorised school administrator.
