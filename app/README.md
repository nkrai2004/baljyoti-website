# Bal Jyoti School OS — V1

## Workspaces
Teacher, Student, Coordinator, Management and Parent.

## Locked decisions (10 November 2026)
- Staff/admin: official school Google Workspace login.
- Student: individual pre-approved Google identity; account provisioning method to be confirmed.
- Parent: verified Google identity and school-approved child links; multiple children supported.
- WhatsApp: manual FOC-first sharing only; no paid API automation or unofficial bots in V1.
- Parent workspace included in V1.

## Development branch implementation
- `index.html`: routes to secure Google sign-in.
- `login.html`: Google sign-in and authorised workspace shell.
- `assets/auth.js`: profile/status check and role/module permission loading.
- `assets/firebase-config.js`: placeholders for a separate staging Firebase project and staging Super Admin UID.
- `user-management/index.html`: Super Admin-only user profile directory and editor.
- `preview.html`: static dashboard concept preview.
- `DECISIONS-V1.md`: locked product decisions.
- `STAGING-FIREBASE-SETUP.md`: setup and security testing guide.

## Critical staging safeguard
The existing ERP1 uses the school's live Firebase project `baljyoti-erp`. The new app is intentionally disconnected from it. The config file contains placeholders only. Create a separate Firebase staging project, enable Google sign-in, configure authorised domains and staging Firestore rules before replacing the placeholders.

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
- No Firebase security rules are changed by this branch.
- Gmail API, Google Classroom API and WhatsApp API are not connected.
- Dashboard modules remain placeholders, not live workflows.

## Deployment
Repository: `nkrai2004/baljyoti-website`
Branch: `baljyoti-school-os-v1`
Path: `app/`
Target after deployment approval: `https://baljyoti.com/app/`

## Production safety
Do not merge to `main`, deploy to production, modify `/erp1/`, or change production Firebase rules until staging tests, record-level access tests, backups and rollback steps are approved.
