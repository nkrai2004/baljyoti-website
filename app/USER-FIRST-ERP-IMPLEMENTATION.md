# Bal Jyoti School OS — User-First Functional Build

## Product promise
The School OS is organised around people and their daily work, not a list of disconnected modules. Every signed-in person must land in a role-specific workspace, see only authorised records, complete their tasks with a clear next step, and receive a confirmation when an action is saved.

## User journeys and release acceptance

### 1. Identity and first sign-in
- Staff use verified official `@baljyoti.com` Google Workspace accounts.
- Student and parent accounts are pre-provisioned and approved; no public self-registration.
- Every profile has one active role, status, display name and account type.
- Pending, disabled, mismatched and unrecognised profiles are stopped with a helpful explanation.
- Demo users are synthetic and must be provisioned in the staging Firebase Authentication project before their Firestore profiles are added. A profile document alone is not a login account.

### 2. Management
- See school-wide KPIs with an explicit data period and source.
- Review admissions, enrolment, attendance, fee collections, dues, staffing and open actions.
- Open a KPI to the underlying authorised records.
- Approve/reject requests with actor, timestamp and reason.
- Sensitive finance, HR and discipline access is separately granted.

### 3. Coordinator
- See only assigned classes, departments or operational scope.
- Review teacher attendance, timetable coverage, syllabus, assessments and pending reports.
- Assign and track actions with owner and due date.
- Escalate exceptions to the Principal.

### 4. Teacher
- See assigned timetable and class/subject allocations.
- Open an assigned class register, mark attendance, review absentees and submit.
- Create lesson plans and homework, share approved materials, enter assessment marks and record student progress.
- Correct submitted records only through an auditable correction flow.

### 5. Student
- See own timetable, attendance, homework, learning material, assessment schedule and published results.
- Submit homework and see submission status.
- Never see another student's profile or unpublished marks.

### 6. Parent
- See only children linked through an active verified parent-child relationship.
- Switch between multiple linked children.
- View attendance, homework, published results, fee invoices/receipts, transport and notices.
- Request a correction or contact the school without editing official records.

## Shared interaction standards
- Mobile-first, accessible, red/white Bal Jyoti visual language.
- Consistent page structure: workspace header, breadcrumbs, search/filter, primary action, record list, detail view, activity history and help text.
- Every form has required-field validation, sensible defaults, duplicate checks where appropriate, save/cancel states and a clear success/error message.
- Destructive actions require confirmation and are auditable.
- Empty, loading, offline, permission-denied and error states are designed; no blank pages.
- Search, filters, pagination and exports must respect the user's record scope.
- All dates use school-local time (Asia/Kolkata); currency is INR.

## Functional module groups
1. Identity & governance: user management, role access, settings, audit logs.
2. Academic setup: academic years, classes, sections, subjects, teacher assignments, timetable.
3. Teaching: attendance, lesson plans, syllabus, homework, learning materials, assessments, marks, progress.
4. Student services: admissions, student records, parent links, student/parent workspaces.
5. Finance: fee structures, invoices, receipts, dues, accounting entries.
6. People: staff records, staff attendance, leave.
7. School life: communication, WhatsApp share (manual), activities, discipline.
8. Operations: transport, library, inventory, tasks, reports.

## Data and security rules
- Firestore Security Rules are the authority; hiding a menu item is not security.
- All operational collections are currently denied by the repository rules baseline. Do not expose live data until collection-specific rules are deployed and tested in staging.
- Teachers are limited to assigned classes/sections/subjects.
- Students are limited to their own records.
- Parents are limited to verified linked children.
- Coordinators are limited to assigned scope.
- Finance, HR, discipline, marks publication and role changes have separate permissions and audit events.
- Never seed real student, parent, staff, fee or health data into demo environments.
- Do not deploy rules to the production `baljyoti-erp` project or modify `/erp1/`.

## Demo environment
- Use only `baljyoti-school-os-staging`.
- Use synthetic names, admission numbers, staff IDs, marks and fee records.
- Demo identities must first exist in Firebase Authentication. Then create matching active user profiles with the intended role and accountType. Do not store passwords in GitHub or Firestore.
- Recommended demo personas: Super Admin, Principal, Academic Coordinator, Teacher, Accountant, Student and Parent. A parent demo must be linked to a synthetic student through a verified demo link.
- Seed data must be repeatable (upsert by stable IDs), clearly labelled DEMO, and removable without touching real records.

## Definition of done
A module is functional only when:
1. The correct role can reach it and an unauthorised role cannot.
2. The correct user can read only their permitted records.
3. Create, view, edit, submit, approve and delete/cancel flows work as applicable and persist after refresh.
4. Validation, loading, empty, offline and error states work.
5. Actions create the required audit event.
6. Automated or documented positive and negative tests pass using separate role accounts.
7. A mobile viewport test is complete.

## Current baseline (10 Nov 2026)
- 33-module catalogue and role navigation exist.
- Role mapping installer exists but has not yet been run by the user.
- Teacher workspace and local demo class register exist.
- Generic module pages currently use in-memory sample rows only.
- Operational Firestore collections are denied by the committed rules baseline.
- Firebase callable functions are not deployed.
- No demo Firebase Authentication accounts have been provisioned.
- No production data or production rules have been changed.
