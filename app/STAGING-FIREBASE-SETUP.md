# Staging Firebase setup — Bal Jyoti School OS V1

This guide is required before Google sign-in or User Management can be tested. The current development code is intentionally disconnected from the production Firebase project.

## A. Create a separate Firebase project
1. Open Firebase Console using the school's authorised Google administrator account.
2. Create a new project, for example `baljyoti-school-os-staging`.
3. Do not select or reuse the existing `baljyoti-erp` project.
4. Add a Web App to the staging project and copy its Firebase web configuration.
5. Enable Google as a sign-in provider in Authentication.
6. Add the intended staging host to Authentication > Settings > Authorised domains.
7. Create a Firestore database in staging. Do not import real student/parent data yet.

## B. Configure the development branch
1. Open `app/assets/firebase-config.js` on branch `main`.
2. Replace the Firebase config placeholders with the new staging project's Web App values.
3. Sign in once with the designated school Super Admin Google account on the staging app.
4. In Firebase Authentication, copy the newly created staging UID for that Google account.
5. Set `window.BJ_SUPER_ADMIN_UID` to that staging UID in `firebase-config.js`.
6. In the staging Firestore console only, create `users/{stagingSuperAdminUid}` with at least:
   - `uid`: staging Super Admin UID
   - `fullName`: approved administrator name
   - `email`: official school Google email
   - `role`: `super_admin`
   - `status`: `active`
   - `accountType`: `staff`
7. Configure the staging `system/roleRegistry`, `system/moduleRegistry`, and `system/roleModuleAccess` documents. Use the existing ERP1 structure as a reference, but review it before copying.

## C. Security rules before data tests
- Start with deny-by-default Firestore rules.
- Allow a signed-in user to read only their own user profile.
- Allow only the designated active Super Admin to manage user profiles and RBAC configuration.
- Do not grant all authenticated users read access to the entire `users` collection.
- Do not enable parent-to-child, teacher-to-class, or student record queries until rules enforce those relationships.
- Never trust hidden menu items or JavaScript role checks as security controls.

## D. Test sequence
1. Super Admin sign-in and profile gate.
2. Staff account with official `@baljyoti.com` email.
3. Reject an unapproved staff profile, inactive profile and mismatched email.
4. Student and parent accounts with pre-approved profiles.
5. Confirm parent-child links cannot expose unlinked children.
6. Confirm non-admin accounts cannot open User Management or write user profiles.
7. Confirm revoked/inactive users are denied after sign-out/sign-in.
8. Review Firestore rules with test accounts before any real data is loaded.

## Important
- Do not use production data during initial tests.
- Do not paste production Firebase configuration or production Super Admin UID into this branch.
- Do not change production Firestore rules, ERP1 files, or the `main` branch.
- Firebase web configuration values identify the project; Firestore Security Rules and Authentication configuration provide the actual protection.


## E. Automatic pending staff registration (V1)
New staff can now register themselves using Google sign-in. The app will create a Firestore `users/{uid}` profile only when:
- the Google email is verified;
- the email ends in `@baljyoti.com`; and
- no school profile already exists for that UID.

The app sets a fixed, non-editable-by-the-user initial profile:
- `role: "staff"`
- `accountType: "staff"`
- `status: "pending"`
- `registrationSource: "google_self_registration"`

The pending user is signed out and shown an approval message. They cannot enter the school workspace until a Super Admin changes the profile to an approved role and sets `status: "active"`.

### Required Firestore rule
In the existing `match /users/{userId}` rule, add a narrowly scoped `allow create` condition for self-registration. Do not replace the full rules file blindly; merge this condition with the current Super Admin rules and test it in the Rules Playground:

```javascript
allow create: if request.auth != null
  && request.auth.uid == userId
  && request.resource.data.uid == userId
  && request.auth.token.email_verified == true
  && request.resource.data.email == request.auth.token.email
  && request.auth.token.email.matches('^[^@]+@baljyoti\\.com$')
  && request.resource.data.role == 'staff'
  && request.resource.data.accountType == 'staff'
  && request.resource.data.status == 'pending'
  && request.resource.data.registrationSource == 'google_self_registration'
  && request.resource.data.keys().hasOnly([
    'uid', 'fullName', 'email', 'role', 'accountType', 'status',
    'mobile', 'admissionNumber', 'linkedAdmissionNumbers',
    'registrationSource', 'createdAt', 'updatedAt'
  ]);
```

Keep user-profile reads restricted to the user's own document and Super Admin access. Keep updates/deletes restricted to Super Admin. The rule above only permits a verified-domain user to create their own pending staff profile; it does not permit role changes or activation.

### Super Admin approval
1. Open User Management.
2. The list defaults to **Pending approvals**.
3. Select **Edit** for the new staff profile.
4. Change the role to the approved role (for example Director) and set Status to **Active**.
5. Save. The staff member can then sign in again.

Students and parents are not self-registered by this workflow. Continue to create their profiles only after school verification.


## F. Staff approval email (Firebase Cloud Function)

When a staff profile changes from `pending` to `active`, the backend sends an approval email from **Bal Jyoti Public School <info@baljyoti.com>** to the approved staff member. The email includes the assigned role and the School OS login instructions. It is not sent for student/parent profiles or for ordinary edits to an already active profile.

### Deployment requirements
- Deploy this function only to the staging Firebase project first.
- Firebase Cloud Functions deployment requires the Firebase project to be on the Blaze (pay-as-you-go) plan. Review current Firebase pricing and set a budget alert before deployment.
- Configure an SMTP service/mailbox that is authorised to send as `info@baljyoti.com`. The SMTP provider must permit that sender address. Do not put SMTP credentials in GitHub or browser JavaScript.
- In the Firebase project, set these four secrets using Firebase CLI prompts (never paste secret values into chat or source files):
  - `SMTP_HOST`
  - `SMTP_PORT` (usually 587 for STARTTLS or 465 for implicit TLS)
  - `SMTP_USER`
  - `SMTP_PASS`
- From the repository root, deploy with Firebase CLI: `firebase deploy --only functions:sendStaffApprovalEmail --project baljyoti-school-os-staging`.
- Verify the function is deployed in region `asia-south1`.

### Email behaviour and verification
- Trigger: a staff user's profile changes from `pending` to `active`.
- Recipient: the approved profile's verified `@baljyoti.com` address.
- Sender: `Bal Jyoti Public School <info@baljyoti.com>`.
- The email states the assigned role and directs the user to `https://baljyoti.com/app/login.html`, using Google sign-in.
- Delivery status is recorded in `users/{uid}.approvalEmailStatus` and `mailNotifications/{uid}_approval`.
- Test with a staging staff account first. Confirm the email arrives, sender identity is accepted, and the approved user can sign in. Do not activate real staff accounts until the test passes.
- SMTP delivery is at-least-once in failure/retry edge cases; check the notification log if a test appears delayed or duplicated.
