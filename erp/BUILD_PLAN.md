# BJPS ERP Integrated Build

## Delivery objective
Deliver one integrated ERP workspace for Bal Jyoti Public School across Management, Admission, Academic, Activity, and Admin & Operations, supported by shared identity, people, documents, notifications, workflows, approvals, audit, reports, and settings.

## Existing foundations
- Firebase Authentication project: `baljyoti-erp`.
- Google Apps Script backend and 14 Google Sheets data stores.
- `erp/workspace.html` is the ERP home page.
- The v1 API currently supports identity/session bootstrap only.
- The schema catalogue contains 348 worksheets and 3,894 field definitions across 14 database templates. It is a draft reference, not a live schema contract.

## Build rules
1. Preserve all public website pages and existing legacy ERP pages.
2. Deny access by default. The browser may display UI state but never grants permissions.
3. Verify Firebase ID tokens on the server for every protected request.
4. Resolve the active ERP user, role assignments, permissions, academic year, and resource scope on the server.
5. Apply row filters and field redaction before returning records.
6. Never expose a generic spreadsheet read/write API.
7. Validate live worksheet headers against the approved schema before enabling a table operation.
8. Use locking, uniqueness checks, audit events, and idempotency for writes.
9. Keep modules unavailable until their authorization and data tests pass.
10. Keep test fixtures separate from school production records.

## Authority and access policy
- Director oversees Management and Admission.
- Principal leads Academic, Activity, and Admin operations; no financial approval authority by virtue of Principal designation.
- Accounts verifies/processes finance. Director approves only within formal delegated limits; Chairman/Governing Body retain reserved matters.
- Principal receives fee status visibility only, not fee amounts or transactions.
- Class Teacher fee status is limited to assigned classes/sections. Subject Teacher has no default fee access.
- Parents access only verified, actively linked children. Students access only their own permitted records.
- Roles are separate from designations; a user may hold multiple roles.
- Super Admin is technical administration, not business approval authority.

## Canonical data ownership
- `SECTION_TEACHER_ASSIGNMENTS` in Core Master is the authoritative class-teacher source.
- Academic `CLASS_TEACHER_ASSIGNMENTS` is historical/reference only.
- Academic `CLASS_SECTION_ASSIGNMENTS` is the canonical student-placement source. Student master current class/section fields are a cache.
- `STUDENT_GUARDIAN_LINK` is the guardian-child relationship source, subject to active dates, verification, and access flags.
- `ERP_*` tables are the proposed active model; `SCHOOL_*` tables remain dormant/reference until migration is approved.
- Audit events should ultimately be stored in Workflow_Audit; the current User_Access audit table is transitional.

## Delivery sequence
### Foundation
- Reconcile live sheet headers and schema versions.
- Complete server-side authorization, scope resolution, row filtering, field redaction, and audit.
- Complete session bootstrap and account provisioning diagnostics.
- Add API contract tests and browser integration tests.

### Shared services
- People and identity directory.
- Notifications and document metadata/access.
- Workflow inbox, approvals, and audit trail.
- Academic-year context, settings, reports, and MIS.

### Functional pillars
- Admission: enquiry through application, verification, selection, enrolment.
- Academic: student information, class/section placement, attendance, timetable, assessment, marks, report cards.
- Activity: clubs, events, competitions, duties, participation.
- Admin: finance/fees, HR, payroll/leave, procurement/inventory, transport, facilities.
- Management: leadership dashboards, governance, approvals, strategic plans, institutional reports.

### Release gate
A module is test-ready only when authorized users can search, view, create, edit, validate, and audit records within permitted scopes; unauthorized users are denied; field-level restrictions are verified; and regression tests pass.
