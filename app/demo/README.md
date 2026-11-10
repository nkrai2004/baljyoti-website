# Staging demo accounts and data

This is a safe staging-only setup guide. It does not create passwords or Firebase Authentication identities.

## Important
A Firestore `users/{uid}` profile is not a login account. Each demo person must first exist in Firebase Authentication. The current GitHub connection can update repository files but cannot create Firebase Authentication users. Do not put passwords, private keys or service-account JSON in this repository.

## Recommended demo personas
Create these identities in the Firebase Authentication project **baljyoti-school-os-staging** only. Use real test Google accounts controlled by the school. For staff personas, use existing test identities on the official `@baljyoti.com` Workspace domain.

| Demo persona | Required role | accountType | Test purpose |
|---|---|---|---|
| Demo Principal | principal | staff | School academic oversight |
| Demo Coordinator | academic_coordinator | staff | Assigned academic operations |
| Demo Teacher | teacher | staff | Class register, attendance, homework, marks |
| Demo Accountant | accountant | staff | Fee and accounts workflow |
| Demo Student | student | student | Own timetable, homework and published results |
| Demo Parent | parent | parent | Verified linked-child view |

Do not use real learner or parent records. Use test identities and the synthetic records in `sample-data.js`.

## Profile fields
After creating each Auth identity, the Super Admin can create its matching `users/{uid}` profile through the approved staging user-management process:

- `uid`: exact Firebase Authentication UID
- `fullName`: demo display name
- `email`: exact verified Auth email
- `role`: one role from the table above
- `accountType`: staff, student or parent
- `status`: active
- `mobile`: blank or a test-only number
- `admissionNumber`: only for student profiles
- `linkedAdmissionNumbers`: only for parent profiles; use the synthetic DEMO admission number after a verified demo link is created

The parent demo must be linked only to a synthetic student record and marked verified in staging. Do not grant parent access merely by entering an admission number.

## Demo data
`sample-data.js` provides fictional academic year, classes, sections, subjects, staff, students, teacher assignments, timetable, attendance, homework, assessment results, fee invoices, announcement and tasks. All IDs are prefixed with DEMO. It is a static dataset at this stage; it is not automatically written to Firestore.

## Current limitation
The app's operational Firestore collections are still denied by the committed rules baseline. Do not import this dataset into Firestore or use real school data until collection-specific rules and role-scoped tests are complete. The generic module screens currently keep changes in browser memory only.

## Sign-in
Use the existing staging login at `/app/login.html`. Never share test passwords in WhatsApp, email drafts, GitHub, or this document. Delete or disable demo Auth identities and their demo profiles after testing.
