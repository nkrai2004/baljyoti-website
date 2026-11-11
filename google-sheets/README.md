# Bal Jyoti School OS — Google Sheets database setup

The School OS uses Google Sheets for operational school records. Firebase remains responsible for sign-in, active staff profiles, role/module configuration and callable API authorization. Staff, parents and students must use the School OS interface; do not share the master spreadsheet with end users.

## Workbook layout

The Apps Script gateway creates structured tabs with fixed headers for:

- Students, Parents, ParentStudentLinks, Admissions
- Classes, Subjects, Staff, TeacherAssignments
- StudentAttendance, StaffAttendance, Timetable
- Homework, Assessments, Marks
- FeeStructures, FeeInvoices, FeePayments, Expenses
- LeaveRequests, TransportRoutes
- LibraryBooks, LibraryIssues, Inventory
- Notices, CalendarEvents, Tasks, AuditLog

The first connected module is Student Records. Other tabs are schema foundations; they are not yet connected to live workflows.

## One-time administrator setup

1. Create a new Google Spreadsheet in the school's Google Workspace account. Name it **Bal Jyoti School OS Database**.
2. Open Extensions → Apps Script from that spreadsheet.
3. Replace the editor contents with the contents of google-sheets/Code.gs from this repository and save.
4. In Apps Script, open Project Settings → Script Properties. Add BJ_SHEETS_API_KEY with a long random secret (at least 32 random characters). Keep it private.
5. Deploy → New deployment → Web app. Execute as **Me**. Set access to **Anyone** so the server-to-server Firebase function can call it. The endpoint is protected by the secret key; do not share the spreadsheet or API key.
6. Copy the Web App URL ending in /exec.
7. In Firebase project baljyoti-school-os-staging, create Functions secrets:
   - SHEETS_API_URL = the Apps Script /exec URL
   - SHEETS_API_KEY = the exact BJ_SHEETS_API_KEY Script Property value
8. Deploy the School OS staging Functions workflow. Do not deploy to the production Firebase project.
9. After deployment, invoke the setup action once using the trusted administrator setup process. It creates the tabs and header rows. It refuses to overwrite mismatched existing headers.
10. Sign in to the staging School OS as Super Admin and use Student Records → Load sample students to insert five fictional records. Sample admission numbers begin BJ-SAMPLE-.

## Important safeguards

- Do not put real student or parent data in sample records.
- Do not share the master workbook with teachers, parents or students. Access must pass through Firebase callable functions and role checks.
- Restrict Google Workspace access to the database owner and designated data custodians.
- Keep version history and regular backups enabled.
- Do not sort a data tab independently of its rows or rename/reorder header columns. Use filters/views instead.
- Google Sheets is suitable for a small school's operational database with controlled write volume. It is not a full relational database: concurrent-write throughput, complex reporting, row-level permissions and large-scale workloads are limited. If usage grows, migrate the same tabular model to a managed database.
- Firebase user profiles and role/module configuration remain in Firestore; operational records are being moved to Sheets module by module.
- No live student records are migrated or imported by this setup.

## Current implementation boundary

Only the Student Records module is wired to the Sheets gateway at this stage. Admissions, attendance, fee management, HR and the remaining tabs are schema definitions only. They must each receive their own validated callable workflows, role/scope checks and automated tests before being described as operational.