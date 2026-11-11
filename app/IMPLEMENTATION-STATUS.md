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
