# Bal Jyoti Public School — Teacher Workspace v2 Prototype

This is a standalone, responsive UX prototype for the first redesign phase of ERP1.

## What is included
- Teacher-first home screen with daily priorities and quick actions.
- Timetable view.
- Class attendance interface with Present / Absent controls and Mark all present.
- Lesson plan form.
- Homework draft form.
- Searchable student list.
- Mobile navigation and responsive layout.
- Bal Jyoti red/white visual direction.

## Important: prototype only
This package uses illustrative sample data. It does **not** authenticate users, read or write Firebase, or change any live school records. Attendance, lesson-plan and homework actions only demonstrate the interaction and show a confirmation message. No production data is stored.

## Preview locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. For a local web server, run `python -m http.server 8080` from this folder and open `http://localhost:8080`.

## Integration plan for ERP1
Before connecting this workspace to Firebase:
1. Confirm the current `users/{uid}` profile fields and active-status convention.
2. Confirm the current role registry and module permissions.
3. Inspect Firestore security rules and existing collections; do not assume the proposed collections already exist.
4. Confirm the actual class, section, subject, teacher assignment, timetable and student record schemas.
5. Map each teacher to only their authorised classes and students.
6. Design attendance writes with duplicate prevention, date/class uniqueness, audit fields and appropriate server-side security.
7. Connect lesson plans and homework to the confirmed school data model.
8. Test with a small set of authorised staff accounts in a staging Firebase project before production rollout.

## Brand asset
The prototype currently uses a text monogram placeholder. Replace it with the official Bal Jyoti Public School torch/emblem logo asset from the existing ERP repository once the correct asset path and usage are confirmed. Do not recreate the logo.

## Suggested repository location
`erp1/teacher-v2/`

The GitHub integration denied branch creation for this session, so this package has not been pushed to the repository. Do not upload it directly to the production branch; create a feature branch first.
