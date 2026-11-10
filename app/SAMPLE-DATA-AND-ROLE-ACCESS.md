# Bal Jyoti School OS — Sample Data & Role Access

## Purpose
This release adds a role-aware sample dashboard using fictional, in-page demo data. It does not seed Firestore or create login accounts. No real student, parent, staff, fee or examination information is included.

## Sample workspaces
| Stakeholder | Dashboard view | Example information |
|---|---|---|
| Management (Director / Principal / Administrator) | School and academic overview | Illustrative enrolment, staffing, attendance, admissions and operational indicators |
| Coordinator | Assigned academic area | Illustrative classes, teachers, syllabus progress and pending reviews |
| Teacher | Assigned teaching work | Illustrative classes, periods, attendance and homework |
| Student | Own learning space | Illustrative attendance, homework, subjects and published result |
| Parent | Linked-child updates | Illustrative attendance, homework and published result |

Other coordinator roles use the coordinator sample layout; operational staff roles use the closest relevant sample workspace. The displayed numbers and names are examples only.

## Role access baseline
The Super Admin configures module grants in the existing Role & Module Access screen. The role/module matrix is documented in `ROLE-MODULE-MATRIX.md`. Dashboard navigation is available to an active, configured account. Other modules require the corresponding module grant.

## Important security boundary
- Hiding a menu item is not data security.
- The dashboard verifies Firebase sign-in, active user profile, matching account email and configured role.
- The sample dashboard reads no student or parent collections and writes no records.
- Real data access must be protected by Firestore Security Rules at collection and record level.
- Teachers must be restricted to assigned classes/subjects; students to their own records; parents to verified linked children; coordinators to assigned areas.
- Finance, HR, discipline and other sensitive data require separate permission checks.
- Do not use the sample figures for school reporting or decisions.

## Sample accounts
No sample authentication accounts are created by this code. Create test accounts through Firebase Authentication and approve their matching `users/{uid}` profiles using the Super Admin workflow. Use school-controlled test identities only; do not use real children's personal details for testing.

## Release status
The sample dashboard is a demonstration layer, not a complete ERP. Timetable, attendance, homework, assessments, fees, HR and parent-child workflows still need their data model, Firestore rules, CRUD screens and positive/negative role tests before real use.
