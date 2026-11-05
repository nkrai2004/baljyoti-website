# Bal Jyoti ERP — Role-Based Starter

## Included
- `index.html`: central Google Workspace login.
- `portals/`: ten separate role portal HTML pages.
- `modules/`: independent module entry pages with module-level role checks.
- `assets/js/firebase-config.js`: existing Bal Jyoti Firebase web configuration.
- `assets/js/access-control.js`: central role, module and portal registry.
- `assets/js/auth.js`: shared sign-in, role lookup and route guard.
- `firestore.rules`: server-side Firestore access rules.
- `role-registry-template.csv`: sample role assignment register.

## Important: this is the role/access foundation, not a completed school ERP
The module pages are secure entry-point examples/placeholders. Their forms, workflows, reports and database schemas still need to be built module by module.

## Firebase setup
1. In Firebase Console, open project `baljyoti-erp`.
2. Authentication → Sign-in method → enable Google.
3. Authentication → Settings → Authorized domains: add `baljyoti.com` and `www.baljyoti.com`. Keep `baljyoti-erp.firebaseapp.com`.
4. Create/enable Cloud Firestore.
5. Publish the included `firestore.rules` in Firestore → Rules.
6. Upload the whole folder to the web host, preserving folder structure. Set the site root to this folder so `/index.html` is the login page.

## Assigning roles (manual bootstrap)
The first Director must be provisioned by a trusted project owner in Firebase Console:
1. Ask the person to sign in once, then find their Firebase Authentication user and copy the UID.
2. Firestore → create collection `userRoles`.
3. Create a document whose document ID is exactly that UID.
4. Add fields:
   - `email` (string): exact official email, e.g. `director@baljyoti.com`
   - `role` (string): `Director`
   - `active` (boolean): `true`
5. Once the Director record exists, Director can manage role records subject to the Firestore Rules. For the initial setup, assign all other users the same three fields with their UID as document ID.

Never allow a user to choose their own role in the browser. Do not create a public role assignment form.

## Role registry fields
`userRoles/{firebaseAuthUid}`
- `email`: exact email from Google Workspace
- `role`: one of the ten role names in `access-control.js`
- `active`: true/false
- Optional: `displayName`, `department`, `employeeId`, `createdAt`, `updatedAt`

## Adding a module
1. Add the module key and display name in `assets/js/access-control.js`.
2. Add role permissions to `BJ_PERMISSIONS`.
3. Add the module's HTML entry page under `modules/`.
4. Add its path in `BJ_MODULE_PATHS`.
5. Add matching server-side permissions to `firestore.rules`.
6. Store data under `moduleData/{moduleKey}/{documentId}` if using the included generic rule pattern.

## Security notes
- Browser-side checks improve navigation but do not secure data by themselves.
- Firestore Rules are the data security boundary. Review and test them against the school's exact privacy and workflow requirements before storing student, parent, staff, fee or examination records.
- The sample rules intentionally default-deny all unspecified collections.
- Do not put Firebase service-account credentials or private keys in HTML/JavaScript.
- Google `hd` is a sign-in hint, not a substitute for validating the actual email and role.
- For production, consider a trusted backend/Cloud Functions for audit logs, role changes, approvals and privileged operations.
