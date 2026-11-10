# Bal Jyoti School OS — Role / Module Matrix (V1)

This matrix is the intended menu-access baseline. It is not a substitute for Firestore record-level security. Sensitive records must remain inaccessible until server-side/rules enforcement and test-account verification are complete.

| Role | Default module grants |
|---|---|
| super_admin | * |
| director | dashboard, reports, audit_logs, user_management, role_access, academic_master, admissions, student_records, fees, accounting, hr_staff, staff_attendance, activities_events, discipline, transport, inventory, tasks, settings |
| principal | dashboard, academic_master, timetable, teacher_assignments, attendance, staff_attendance, lesson_plans, syllabus_tracker, homework, learning_materials, assessments, marks_results, student_progress, student_records, admissions, communication, activities_events, discipline, reports, tasks |
| administrator | dashboard, user_management, academic_master, student_records, admissions, parent_links, staff_attendance, communication, activities_events, transport, library, inventory, tasks, reports |
| academic_coordinator | dashboard, academic_master, timetable, teacher_assignments, attendance, lesson_plans, syllabus_tracker, homework, learning_materials, assessments, marks_results, student_progress, activities_events, tasks, reports |
| admission_coordinator | dashboard, admissions, student_records, parent_links, communication, tasks, reports |
| activity_coordinator | dashboard, activities_events, communication, tasks, reports |
| sports_discipline_coordinator | dashboard, activities_events, discipline, communication, tasks, reports |
| teacher | dashboard, timetable, attendance, lesson_plans, syllabus_tracker, homework, learning_materials, assessments, marks_results, student_progress, student_records, communication, whatsapp_share, activities_events, leave, tasks |
| accountant | dashboard, fees, accounting, reports, tasks |
| hr_manager | dashboard, hr_staff, staff_attendance, leave, tasks, reports |
| staff | dashboard, timetable, communication, leave, tasks |
| student | dashboard, timetable, attendance, homework, learning_materials, assessments, marks_results, student_progress, activities_events, library, communication |
| parent | dashboard, timetable, attendance, homework, marks_results, student_progress, fees, transport, communication, activities_events |

## Mandatory access boundaries

- Teacher access is restricted to assigned classes, sections, subjects and approved student records.
- Student access is restricted to the signed-in student's own records.
- Parent access is restricted to approved linked children; multi-child links are supported.
- Accountant access is restricted to finance records; no HR or discipline access by default.
- HR access is restricted to staff records; no student academic/finance access by default.
- Coordinator access is scoped to the assigned academic/operational area.
- Principal and Director access is school-scoped, with sensitive HR, fee and discipline fields separately controlled.
- Super Admin is for technical configuration, not routine viewing of sensitive student records.

## Release gates

1. Create the module registry with the exact IDs used by this catalogue.
2. Review and approve role grants in staging.
3. Implement Firestore rules for every collection and query pattern.
4. Seed synthetic test records only.
5. Test allowed and denied reads/writes with separate test accounts.
6. Do not import live student/parent/fee data before security sign-off.
