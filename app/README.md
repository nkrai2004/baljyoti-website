# Bal Jyoti School OS — V1

## Workspaces
Teacher, Student, Coordinator, Management and Parent.

## Locked decisions (10 November 2026)
- Staff/admin: official school Google Workspace login.
- Student: individual pre-approved Google identity; account provisioning method to be confirmed.
- Parent: verified Google identity and school-approved child links; multiple children supported.
- WhatsApp: manual FOC-first sharing only; no paid API automation or unofficial bots in V1.
- Parent workspace included in V1.

## Universal experience design review (11 November 2026)\n- `UNIVERSAL-UX-DESIGN-REVIEW.md`: scored assessment of Universal Experience v2.0, recommended improvements, decisions, wireframe scope, validation criteria and phased roadmap.\n- Overall design direction: 8.2/10 readiness-adjusted score; detailed design and approval required before implementation.\n- This is a design document only; no application code, Firebase configuration or deployment was changed by the review.\n\n## Main-branch implementation
- `index.html`: routes to secure Google sign-in.
- `login.html`: Google sign-in and authorised workspace shell.
- `assets/auth.js`: profile/status check and role/module permission loading.
- `assets/firebase-config.js`: separate staging Firebase web-app configuration; staging Super Admin UID remains to be added after first Google sign-in.
- `user-management/index.html`: Super Admin-only user profile directory and editor.
- `preview.html`: static dashboard concept preview.
- `DECISIONS-V1.md`: locked product decisions.
- `STAGING-FIREBASE-SETUP.md`: setup and security testing guide.

## Critical staging safeguard
The existing ERP1 uses the school's live Firebase project `baljyoti-erp`. The new app is connected only to the separate `baljyoti-school-os-staging` Firebase project. Google sign-in is enabled, `baljyoti.com` and `www.baljyoti.com` are authorised, and initial deny-by-default Firestore rules with Super Admin profile access have been published. The staging Super Admin UID is still a placeholder and must be configured after the first Google sign-in.

## Account provisioning
- No automatic Firestore profile creation at login.
- Staff profiles require official `@baljyoti.com` email addresses.
- Student and parent profiles must be pre-approved and active.
- Firebase Authentication identities must exist before a school profile can be assigned.
- User Management does not create/delete Firebase Authentication accounts or passwords.
- The designated Super Admin UID must be the UID from the staging Firebase project, not the production project.
- Parent child links are stored as admission numbers for now; this does not grant child-record access until record-level rules and verified student mapping are implemented.

## Security and limitations
- UI role checks only control navigation; they are not a security boundary.
- Firestore rules must enforce record-level permissions for all reads and writes.
- Do not expose student, parent, fee, health or discipline records until those rules are implemented and tested.
- No production Firebase security rules are changed by this branch. Staging Firebase rules were configured separately in the staging console.
- Gmail API, Google Classroom API and WhatsApp API are not connected.
- Role-specific sample dashboards and a common in-session sample workflow are implemented for the module catalogue. Demo changes are not persisted. Operational Firestore collections remain denied by the repository rules baseline until collection-specific record-level policies are approved and deployed.

## Deployment
Repository: `nkrai2004/baljyoti-website`
Branch: `main` (all School OS updates are committed here by user instruction)
Path: `app/`
Target: `https://baljyoti.com/app/`
GitHub Pages publication and live Firebase rules deployment must be verified separately.

## Production safety
Do not modify `/erp1/` or change production Firebase rules. The repository contains a deny-by-default `firestore.rules` baseline registered in `firebase.json`; it has not been deployed. Operational collections must remain unavailable until their rules and role tests are complete.

## User-first functional build (10 November 2026)
- `USER-FIRST-ERP-IMPLEMENTATION.md`: role-based user journeys, shared UX standards, security requirements and definition of done.
- `demo/sample-data.js`: synthetic cross-module demo records (not automatically seeded to Firestore).
- `demo/README.md`: safe staging demo-account setup; Firebase Authentication identities must be created in the staging console before profiles can be assigned.
- Current status remains prototype: module edits are not persistent, operational Firestore collections remain denied, and demo Auth accounts have not been provisioned. Do not use real school data yet.
