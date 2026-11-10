# Bal Jyoti School OS — V1

## Workspaces
Teacher, Student, Coordinator, Management and Parent.

## Locked decisions (10 November 2026)
- Staff and authorised administrators: official school Google Workspace sign-in.
- Student: individual, pre-approved Google identity; account provisioning method to be confirmed.
- Parent: verified Google identity and school-approved child links; one parent may be linked to multiple children.
- WhatsApp: manual FOC-first sharing only; no paid API automation or unofficial bots in V1.
- Parent workspace included in V1.

## Development branch implementation
- `index.html`: routes the app entry point to secure sign-in.
- `login.html`: Google sign-in interface and authorised workspace shell.
- `assets/auth.js`: checks the authenticated identity against `users/{uid}`, requires an active profile, checks staff email domain, and loads role/module permissions from the existing `system/roleRegistry`, `system/moduleRegistry` and `system/roleModuleAccess` documents.
- `assets/firebase-config.js`: staging-only configuration template. It intentionally contains placeholders and does not connect to the live Firebase project.
- `user-management/index.html`: Super Admin-only profile management UI. It is designed to write only user profile documents after staging configuration and rules have been validated.
- `preview.html`: static dashboard concept preview.
- `DECISIONS-V1.md`: locked product decisions.

## Critical staging safeguard
The existing ERP1 uses Firebase project `baljyoti-erp`, which is the school's live project. The new app must not connect to that project during development. The staging configuration file is deliberately left with placeholders. Create a separate Firebase staging project, enable Google sign-in, configure authorised domains and deploy/test staging Firestore rules before replacing placeholders.

## Account provisioning
- No automatic Firestore profile creation at login.
- Staff profiles require official `@baljyoti.com` emails.
- Student and parent profiles must be pre-approved and active.
- Firebase Authentication identities must exist before a school profile can be assigned.
- User Management does not create/delete Firebase Authentication accounts or passwords.
- Parent-child mapping is stored as admission numbers for now; this does not grant child-record access until record-level Firestore rules and verified student mapping are implemented.

## Security and limitations
- The app checks role/module permissions for navigation, but UI checks are not a security boundary.
- Firestore rules must enforce record-level permissions for all reads/writes.
- Do not expose student, parent, fee, health or discipline records until those rules are implemented and tested.
- No Firebase security rules are changed by this branch.
- No Gmail API, Google Classroom API or WhatsApp API is connected.
- Dashboard modules are placeholders, not live workflows.

## Deployment
Repository: `nkrai2004/baljyoti-website`
Branch: `baljyoti-school-os-v1`
Path: `app/`
Target URL after approved deployment: `https://baljyoti.com/app/`

## Production safety
Do not merge to `main`, deploy to production, modify `/erp1/`, or change production Firebase rules until staging tests, record-level access tests, backups and rollback steps are approved.
