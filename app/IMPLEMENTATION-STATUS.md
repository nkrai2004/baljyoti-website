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
