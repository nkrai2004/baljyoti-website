# ERP implementation and staging release plan

## Repository and release safety
- All School OS code changes are committed directly to the `main` branch, as requested.
- Deployment target: `https://baljyoti.com/app/`. Preserve the existing `/erp1/` application and unrelated website files.
- Firebase target: `baljyoti-school-os-staging` only.
- GitHub Actions workflow is manually triggered and targets only `approveStaffUser` and `deleteSchoolUser` today. It is not a full ERP deployment pipeline.
- Cloud Functions deployment is currently blocked because Cloud Build / Artifact Registry APIs and billing eligibility have not yet been verified. Do not rerun until project owner has reviewed billing and required APIs.

## Current code audit (10 Nov 2026)
The app provides Google sign-in, active-profile gating, Super Admin user management, role-to-module configuration, role-specific dashboards and a common sample-workflow interface for all catalogue modules. The module interface supports in-session demo record search, add, edit, delete and reset with role-specific edit controls. Demo records are fictional and are not stored in Firestore. These are prototype workflows, not production CRUD: no business collection is read or written. Firestore record-level security, approved schemas, persistent CRUD, audit trails and role-specific query scoping remain outstanding.

The existing `schoolData` collection belongs to the earlier ERP1 data model. Do not assume it is a complete or clean source of truth. Audit and map it before migration.

## Implementation order
1. Core shell: responsive navigation, role dashboard, route guard, error/loading/empty states. (Prototype dashboard and role-guarded sample workspaces are now in main.)
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
