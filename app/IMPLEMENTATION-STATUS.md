# Bal Jyoti School OS — Implementation Status

**Updated:** 11 November 2026  
**Repository:** `nkrai2004/baljyoti-website` · `main`  
**Development target:** `https://baljyoti.com/app/`  
**Firebase target:** `baljyoti-school-os-staging` only

## Current delivery

### Phase 1 — Universal experience foundation

Implemented in this phase:

- Added `app/home.html` as the new role-aware universal School OS home.
- Added the five approved destinations: Home, Conversations, My Work, Explore and Profile.
- Added responsive desktop navigation and mobile bottom navigation.
- Added a personalised greeting and primary-role display.
- Added a command-style service finder that searches only modules granted to the signed-in role. It opens a service; it does not execute school-record changes.
- Added role-based quick actions and purpose-based Explore categories.
- Added explicit empty states for My Day, notices, activity feed, conversations and tasks where no persistent backend service is connected.
- Added profile summary and sign-out/help controls.
- Routed successful sign-ins to the universal home.
- Added verified-email checking to the universal home.
- Preserved the existing Firebase authentication and role/module grant checks.

## Phase 2 — Individual module permission foundation

Committed to `main`:

- Added `userModuleOverrides/{uid}` as a separate per-user permission record with explicit `allow` and `deny` module lists.
- Added the Super Admin callable `setUserModuleOverrides`. It validates active module IDs, prevents Super Admin overrides and conflicting allow/deny entries, and writes an audit event.
- Added a Super Admin-only editor at `app/user-management/custom-access.html`, linked from Role & Module Access.
- Updated sign-in, universal home and module entry checks to combine role grants with per-user exceptions.
- Added Firestore rules allowing only the target active user and Super Admin to read an override. Client-side create/update/delete are denied; the callable uses the Admin SDK.
- Existing operational data collections remain denied by the catch-all rule.

**Boundary:** these are module-level exceptions only. They do not grant access to individual student, parent, fee, HR, attendance or other records. Record-level security remains disabled until each data collection has approved rules and tests.

## Phase 3 — Shared school services foundation

Committed to `main`:

- Added trusted callable workflows for task creation and assignee status updates.
- Added notice submission with a mandatory pending-approval state and Director/Principal/Super Admin review.
- Added calendar event submission with explicit audience groups and a mandatory pending-approval state.
- Prevented authors from approving their own notices or calendar events.
- Added actor, action, target, timestamp and workflow metadata to audit events.
- Added input limits, active-profile checks, role checks and date validation.
- Added logical schemas for `schoolTasks`, `schoolNotices` and `schoolCalendarEvents`.
- Updated the Functions lint command to syntax-check both the entry point and shared service module.

**Not yet connected:** no browser-facing list/read interface is enabled. Firestore's catch-all deny rule still blocks direct client access to these records. The callable services use the Admin SDK for controlled writes; audience-aware reads and scoped task views are a separate security phase.


## Phase 4 — Scoped reads and initial workspace connection

Committed to `main`:

- Added bounded callable reads for tasks assigned to the signed-in user.
- Added author-only reads for a user's own notice and calendar submissions.
- Added reviewer-only pending notice and calendar queues for Super Admin, Director and Principal.
- Read responses expose an explicit allowlist of fields and are capped at 50 records per call.
- Connected the universal My Work view to the assigned-task list and task status updates.
- Connected management review queues to notice and calendar approve/reject callables.
- Kept published notice/event audience reads disabled. Audience labels are not trusted as proof of class, section or responsibility membership.
- Kept Firestore operational collection rules deny-by-default; browser access uses callable services rather than direct collection queries.

**Not yet connected:** notice/event submission forms, author submission history in the UI, published audience-aware notices, and a full academic calendar view. The current review queues are bounded first-page lists (up to 50 records), not a paginated archive.

**Verification boundary:** source-level syntax and static checks only. No callable was deployed or exercised against Firebase, no Firestore emulator/security tests were run, and no browser end-to-end test was performed. The UI is committed but not confirmed deployed at `https://baljyoti.com/app/`.


## Phase 5 — Notice and calendar submission workflows

Committed to `main`:

- Added staff-facing notice submission form with title, message, category and requested audience.
- Added calendar event submission form with title, description, start/end dates, category, location and requested audience.
- Added author-only submission history panels showing each item's current workflow status.
- Connected both forms to the existing trusted callable submission endpoints; successful submissions return to the pending-approval workflow.
- Restricted requested audience labels on the server to the fixed set `all_school`, `staff`, `students` and `parents`. Arbitrary client-supplied audience labels are rejected.
- Kept audience values as requested metadata only. They do not grant access or trigger publication/delivery. Published audience reads remain disabled until canonical membership and audience enforcement are implemented.
- Kept all operational Firestore client reads/writes denied by the existing catch-all rule.

**Workflow boundary:** no edit/withdraw/resubmit action is provided for pending or rejected items. Review decisions are available only through the management review queue, and authors cannot approve their own submissions.

**Verification boundary:** source syntax/static checks only. No deployed callable execution, emulator tests, browser tests, accessibility audit or live submission was performed. Changes are committed to GitHub `main`, not confirmed deployed.


## Phase 6 — Workflow reliability and validation

Committed to `main`:

- Extracted shared validation helpers for text normalization, strict real-calendar ISO dates, requested audience groups and rejection reasons.
- Added Node's built-in test coverage for text normalization, leap-year/date boundaries, audience normalization and rejection-reason validation.
- Updated the Functions lint command to syntax-check the workflow modules and run the validation unit tests.
- Management rejection now requires a reason of at least three characters; the reason is retained and returned in the author's submission history.
- Added controlled notice and calendar resubmission callables. Only the original author can resubmit their own rejected item; only rejected records can be resubmitted. Resubmission resets review metadata, returns the record to `pending_approval` and writes an audit event.
- Added author-facing “Edit and resubmit” actions that prefill the rejected submission and send it through the resubmission callable.
- Improved server-side date validation to reject impossible calendar dates (for example, 31 April) rather than relying only on JavaScript date parsing.
- Kept audience values as requested metadata; no audience delivery or published audience read access is enabled.

**Verification performed:** JavaScript syntax parsing passed for the updated service, helper, test file and home-page inline script. The four pure validation tests were executed with Node's test runner and passed. Static checks confirmed the resubmission endpoints, rejection-reason gates and Firestore catch-all deny rule.

**Not verified:** Firebase callable integration, Firestore transaction behavior in an emulator, browser end-to-end flows, accessibility, staging deployment or production deployment. The tests cover pure validation helpers, not role authorization or Firestore data access.

## Operational status — important

The universal home is a navigation and experience foundation. It does not make unconnected modules operational.

The following are **not yet connected to persistent operational services** and are intentionally shown as unavailable/empty rather than sample live data:

- Activity feed and pinned notices
- Conversations and message delivery
- My Work task lists, reminders and approvals
- Live timetable and My Day schedule
- User language preference control
- Per-user custom permission overrides beyond existing role/module grants
- Live data for admissions, attendance, fees, payroll, HR, transport, library and inventory

Existing module prototypes may still use browser-local sample data. They must not be treated as school records.

## Security posture retained

- Existing Firestore rules continue to deny operational collections by default.
- No permissive Firestore rules were added.
- No production Firebase configuration or data was changed.
- No real student, parent, staff, fee or HR records were imported.
- The universal home checks the signed-in user's active profile, verified email, role registry and role/module grants.
- Hiding a service in the interface is not a security boundary. Every operational collection still needs schema-specific Firestore rules and/or trusted backend validation, including record-level scope checks.
- Super Admin's existing preview remains a view-only navigation preview; this change does not impersonate another user.

## Next implementation phases

1. **Access model:** formalise role + per-user custom grants, scope assignments and negative access tests.
2. **Common data services:** validated server-backed audit events, tasks, notices and academic calendar.
3. **Core school workflows:** student/parent master records, admissions, attendance, timetable and assessment.
4. **Finance and people:** fee plans, payments/reconciliation, concession approvals, HR, leave and payroll.
5. **School operations:** transport safety, library/e-library, inventory/assets and procurement.
6. **Communication:** governed feed, notices, direct/group conversations, moderation and notifications.
7. **Assistant and analytics:** permission-aware read-only AI, role dashboards and reports.
8. **Release readiness:** accessibility, performance, data migration, security tests and staging acceptance.

Each phase must use synthetic staging data until the collection rules, backend validation, record-level access tests and school approval are complete.

## Verification performed for Phase 1

- GitHub confirmed the new home page and updated sign-in redirect on `main`.
- The inline JavaScript in the new home page passed a JavaScript syntax parse.
- This is not a browser end-to-end test, Firestore rules test, accessibility audit or deployment verification.

## Phase 7 — Staging integration and security-test foundation

Committed to `main`:

- Added Firestore emulator configuration using a dedicated local port and disabled emulator UI.
- Added `@firebase/rules-unit-testing` and Firebase client SDK development dependencies for rules tests.
- Added `functions/firestore-rules.test.js` with synthetic profiles and records. It tests own-profile access, cross-user profile denial, Super Admin-only user listing, operational collection denial, module-override owner/Admin reads, client-write denial, and active-profile/email matching.
- Added `test`, `test:validation`, and `test:security` scripts. The standard test command runs both pure validation tests and Firestore rules tests.
- Added GitHub Actions workflow `.github/workflows/test-staging-security.yml` to install test dependencies and run the test suite inside the Firestore emulator on relevant changes to `main`, pull requests and manual dispatch.
- Test project ID is `demo-baljyoti-school-os`; emulator tests use synthetic records only. No production or staging credentials are used by the test workflow.
- Firestore operational collection rules remain deny-by-default. No permissive rules were introduced.

**Verification status:** GitHub confirms the test files, emulator configuration and workflow are committed. The emulator suite and GitHub Actions run have not yet been independently observed as passing in this phase. Do not treat the tests as executed or as proof of callable authorization. These are Firestore client-rules tests; they do not yet exercise callable functions, Admin SDK transactions, role-specific review/resubmission flows, or browser end-to-end behavior.

**Deployment status:** no Firebase deployment was run. No staging or production data was changed. Existing staging deployment workflow was not invoked.

## Phase 8 — Callable authorization policy and test coverage

Committed to `main`:

- Extracted the authorization decisions used by school workflow callables into `functions/workflow-policy.js` so the same policy logic can be tested independently.
- Updated `functions/school-services.js` to use the shared policy for active-profile/email matching, role checks, task status ownership, reviewer eligibility, prevention of self-review, and author-only resubmission of rejected records.
- Added `functions/workflow-policy.test.js` with synthetic role/identity cases:
  - active profile and matching email required;
  - leadership-only task assignment/status authority;
  - separate notice-author and calendar-author role sets;
  - only Super Admin, Director and Principal are reviewers;
  - authors cannot review their own submissions;
  - only the original author can resubmit, and only while status is rejected.
- Added policy tests to the standard test suite and added the policy module to JavaScript syntax checks.
- Existing Firestore emulator rules tests remain part of the same CI test command.

**Verification:** GitHub Actions started the security workflow for Phase 7 and Phase 8 commits. At the time this status entry was written, dependency installation was still running and test execution had not yet completed. Results must be checked before treating this phase as passing.

**Scope boundary:** these are tested policy decisions called by the callable implementations, plus Firestore client-rules emulator tests. They are not a full end-to-end callable emulator test: Admin SDK transaction behavior, actual callable HTTP invocation, Authentication emulator identity issuance, concurrent review/resubmission races, and browser flows remain unverified. No synthetic users were created in the real staging Firebase project.

**Staging/release boundary:** no Functions deployment was performed. The existing staging deploy workflow was not invoked and currently only names the two user-administration functions; it does not deploy the school workflow callables. Do not use the live workflow forms until the school workflow functions have been separately deployed to staging and callable integration tests pass. Production Firebase and ERP1 remain untouched.

### Phase 8 staging deployment preparation

- Updated the manual staging Functions workflow to include the task, notice, calendar, scoped-read and resubmission callable endpoints, in addition to the existing staff-administration endpoints.
- The workflow remains `workflow_dispatch` only and targets `baljyoti-school-os-staging` explicitly.
- The workflow was **not run**. This change only prepares the deployment definition; it does not deploy code or change Firebase.
- The workflow does not deploy Firestore rules. The catch-all deny rule remains unchanged.

### Phase 8 callable emulator integration suite

- Added `functions/callable-integration.test.js`. It creates temporary test identities through the Firebase Authentication emulator, seeds synthetic Firestore profiles/records, and calls the Functions emulator over its callable HTTP interface.
- Scenarios include unauthenticated calls, teacher submission, required rejection reasons, reviewer-role restrictions, self-review denial, author-only resubmission, rejected-only resubmission, task leadership/assignee restrictions, parent-account task assignment denial, scoped list/history calls and profile/token email mismatch.
- Configured the Auth emulator and updated CI to start Auth, Firestore and Functions emulators for the full suite.
- Added `test:callables` and `test:emulator` scripts. The integration test uses only the demo emulator project and creates no live Firebase accounts or records.

**Latest verification:** the earlier CI run for the rules and policy suite completed successfully with 14/14 tests passing. The new full callable-emulator CI run for commit `944ab553da6952e792aa3154437f7d16f321dc9b` was still running at the time of this update; its callable integration result is not yet confirmed. A successful policy/rules run is not a substitute for this integration result.

**Known dependency note:** the CI dependency installation reported 15 npm audit advisories (9 moderate, 6 high) in the resolved dependency tree. No automatic or force upgrade was applied. Review the audit details and update dependencies deliberately before production release.

### Callable emulator test findings and correction

- The first callable-emulator run exposed a real wiring defect: the service module called shared policy helpers without importing them. The emulator caught this as an internal callable error. The policy import is now added in commit `86e699c7c392f25d6eba90e4db6feac90c0d874e`.
- The same run showed the Functions emulator attempting to retrieve SMTP secrets from Google Secret Manager during local startup. CI now supplies dummy SMTP values through a temporary emulator-only `functions/.secret.local`; no real SMTP credentials are used.
- A new CI run was started after these corrections. Its result is pending and must be checked before claiming callable integration tests pass.


## Current verification update — 11 November 2026

- The corrected GitHub Actions security workflow completed successfully on commit `2740e9871d6a20427149305311fc8754786e1cbc`.
- Confirmed test results: **14/14** Firestore rules, workflow-policy and validation tests passed; **8/8** callable emulator integration tests passed. The callable tests exercised the Functions, Authentication and Firestore emulators with synthetic identities/data.
- Workflow run: https://github.com/nkrai2004/baljyoti-website/actions/runs/42977525468
- The first callable integration attempt failed and exposed a missing policy-helper import; that defect was fixed before the successful run. The emulator-only SMTP placeholder setup also resolved local startup's Secret Manager dependency.
- Changed `app/index.html` so the default `/app/` entry opens `home.html`. The home page still checks Firebase authentication and redirects signed-out visitors to `login.html`; it does not bypass sign-in or role checks.
- The index redirect change is committed to `main` in commit `6c3a3fd2f9cef269cf26b40602fbe7a99de7a2e6`.

**Still not verified/deployed:** the current hosted contents of `https://baljyoti.com/app/` have not been confirmed after the commit; no staging Functions deployment or browser acceptance test has been run. Workflow buttons that call the new school-service functions will not work on a live environment until those functions are deployed to staging. Do not treat prototype module screens or local/sample data as operational school records.

**Remaining functional gaps:** persistent operational services and record-level authorization for admissions, student/parent records, attendance, timetable, assessments/results, fees/accounts, HR/leave, transport, library, inventory, reports and communication; published audience-aware notices/calendar feeds; direct/group messaging; activity feed; real timetable/My Day; pagination and broader operational reporting; mobile/desktop end-to-end and accessibility testing; and deliberate review of the 15 npm audit advisories (9 moderate, 6 high).

**Release boundary:** no staging or production Firebase deployment was performed by this update. Production Firebase `baljyoti-erp` and ERP1 remain untouched.


## Phase 9 — Isolated browser demo workspace

Committed to `main`:

- Added `app/demo.html`, a standalone School OS demonstration workspace covering 18 school areas: students, admissions, parents/guardians, staff, attendance, timetable, homework, exams/results, fees, expenses/accounts, HR/leave, transport, library, inventory/assets, notices, calendar, tasks/approvals, communication log, and facilities/maintenance.
- Seeded each module with fictional sample records and explicit demo identifiers where relevant.
- Added browser-local create, edit, delete, search and status-filter actions, plus JSON export and reset-to-sample-data controls.
- Demo changes persist in the current browser using local storage. They are not sent to Firebase or any school server.
- Added a persistent warning that the environment is demo-only and must not contain real student, parent, employee or financial information.
- Kept the demo workspace separate from the authenticated School OS and existing operational services.

**Verification boundary:** GitHub confirms the demo page is committed to `main`. This is a browser-local demonstration, not a production workflow or shared multi-user database. No Firebase collections, Firestore rules, staging services or production records were changed. Browser end-to-end and accessibility testing are still pending. Do not represent the sample data as official school records or the modules as production-ready.

**Next:** perform browser smoke tests on desktop and mobile, then connect modules incrementally to isolated staging services with per-record authorization and automated tests. Prioritize student/parent master data, admissions, attendance, timetable and assessment before finance and HR.


- Added a link to the demo workspace under the authenticated School OS Explore page so users can find the demo from the main app. This is navigation only and does not change the demo's browser-local storage or security boundary.
