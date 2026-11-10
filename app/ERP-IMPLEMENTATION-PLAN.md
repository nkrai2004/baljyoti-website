# ERP implementation and staging release plan

## Repository and release safety
- Development branch: `school-os-staging`.
- Production branch `main` and existing `/erp1/` are protected from this work.
- Firebase target: `baljyoti-school-os-staging` only.
- GitHub Actions workflow is manually triggered and targets only `approveStaffUser` and `deleteSchoolUser` today. It is not a full ERP deployment pipeline.
- Cloud Functions deployment is currently blocked because Cloud Build / Artifact Registry APIs and billing eligibility have not yet been verified. Do not rerun until project owner has reviewed billing and required APIs.

## Current code audit (10 Nov 2026)
The current app provides Google sign-in, user profile gating, a Super Admin user directory, role-to-module configuration UI and a static dashboard concept preview. The login page renders module cards from Firestore. The role/module UI is not a full set of functional modules. No complete student, attendance, timetable, homework, exam, fee, HR, transport or parent workflows are implemented yet.

The existing `schoolData` collection belongs to the earlier ERP1 data model. Do not assume it is a complete or clean source of truth. Audit and map it before migration.

## Implementation order
1. Core shell: responsive navigation, role dashboard, route guard, error/loading/empty states.
2. Master data: academic years, classes, sections, subjects, staff, students, parents, teacher assignments.
3. Academic workflows: timetable, attendance, lesson plans, syllabus, homework, learning materials, assessments, marks/results, progress.
4. School administration: admissions, parent-child links, communication, activities, discipline.
5. Operations: staff attendance, leave, HR, fees, accounts, transport, library, inventory, tasks.
6. Governance: reports, audit logs, school settings.
7. Security: collection-level and record-level Firestore rules, query constraints, callable backend operations where privileged actions are required.
8. QA: mobile, desktop, role matrix, access-denial tests, duplicate prevention, audit, backup and restore.
9. Staging release and school sign-off. Production is a separate release requiring explicit approval.

## Data model proposal (subject to audit)
`users`, `staffRecords`, `students`, `parents`, `parentStudentLinks`, `academicYears`, `classes`, `sections`, `subjects`, `teacherAssignments`, `timetables`, `studentAttendance`, `staffAttendance`, `lessonPlans`, `syllabusProgress`, `homework`, `homeworkSubmissions`, `learningMaterials`, `assessments`, `assessmentResults`, `admissions`, `feeStructures`, `feeInvoices`, `feeReceipts`, `leaveRequests`, `announcements`, `schoolEvents`, `disciplineCases`, `transportRoutes`, `libraryItems`, `libraryLoans`, `inventoryItems`, `tasks`, `auditLogs`.

No production records should be migrated until the schema, data quality and access rules are approved.
