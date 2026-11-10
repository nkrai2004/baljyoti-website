# School OS data model and security plan

## Release boundary
This is the proposed Firestore model for Bal Jyoti School OS. Do not import production data until the school has approved the fields, retention policy, parent verification process and security tests. All examples are synthetic.

## Core identity and academic master
| Collection | Document key | Main fields |
|---|---|---|
| users | Firebase Auth UID | fullName, email, role, accountType, status |
| staffRecords | staffId | uid, employeeCode, name, department, designation, status |
| students | studentId | admissionNumber, fullName, academicYearId, classId, sectionId, status |
| parents | parentId | uid, fullName, verifiedPhone, email, status |
| parentStudentLinks | linkId | parentUid, studentId, admissionNumber, verificationStatus |
| academicYears | yearId | label, startDate, endDate, active |
| classes | classId | name, sortOrder, active |
| sections | sectionId | classId, name, academicYearId, active |
| subjects | subjectId | name, code, classIds, active |
| teacherAssignments | assignmentId | teacherUid, classId, sectionId, subjectId, academicYearId |

## Teaching and learning
| Collection | Document key | Main fields |
|---|---|---|
| timetables | timetableId | academicYearId, classId, sectionId, day, period, subjectId, teacherUid |
| studentAttendance | attendanceId | dateKey, studentId, classId, sectionId, status, markedByUid |
| staffAttendance | attendanceId | dateKey, staffUid, status, markedByUid |
| lessonPlans | lessonPlanId | teacherUid, classId, sectionId, subjectId, date, topic, status |
| syllabusProgress | progressId | classId, sectionId, subjectId, unit, completion, updatedByUid |
| homework | homeworkId | teacherUid, classId, sectionId, subjectId, title, dueAt, status |
| homeworkSubmissions | submissionId | homeworkId, studentUid, studentId, submittedAt, attachmentRef, status |
| learningMaterials | materialId | teacherUid, classId, subjectId, title, storageRef, status |
| assessments | assessmentId | classId, sectionId, subjectId, title, date, maxMarks, status |
| assessmentResults | resultId | assessmentId, studentId, marks, enteredByUid, publicationStatus |
| studentProgress | progressId | studentId, classId, sectionId, subjectId, observation, createdByUid |

## Administration and operations
| Collection | Document key | Main fields |
|---|---|---|
| admissions | enquiryId | applicantName, classApplied, guardianContact, status, ownerUid |
| feeStructures | feeStructureId | academicYearId, classId, feeHead, amount, dueSchedule |
| feeInvoices | invoiceId | studentId, academicYearId, lineItems, total, dueAt, status |
| feeReceipts | receiptId | invoiceId, studentId, amount, receivedAt, receiptNumber |
| accountingEntries | entryId | date, entryType, ledgerCode, amount, description, createdByUid |
| leaveRequests | leaveId | applicantUid, leaveType, fromDate, toDate, status, approverUid |
| announcements | announcementId | audience, classIds, title, body, publishAt, createdByUid |
| schoolEvents | eventId | title, date, audience, ownerUid, status |
| disciplineCases | caseId | studentId, category, restrictedNotes, status, ownerUid |
| transportRoutes | routeId | routeName, vehicleId, stopIds, active |
| studentTransportLinks | linkId | studentId, routeId, stopId, academicYearId |
| libraryItems | itemId | accessionNumber, title, author, category, status |
| libraryLoans | loanId | itemId, studentId, issuedAt, dueAt, returnedAt |
| inventoryItems | itemId | assetCode, name, quantity, location, status |
| tasks | taskId | title, ownerUid, dueAt, status, relatedModule |
| auditLogs | logId | actorUid, action, collection, documentId, createdAt |

## Access policy
- Super Admin: technical identity and configuration administration; not a default business-data viewer.
- Director: school-wide oversight, with separate access grants for finance, HR and discipline.
- Principal: school academic oversight and approved student services.
- Coordinators: only assigned operational or academic areas/classes.
- Teachers: only assigned classes, sections, subjects and students.
- Students: own timetable, attendance, homework, submissions and published results only.
- Parents: only students with an active, verified parentStudentLinks record; multiple children supported.
- Accountant: fee and accounting collections only.
- HR Manager: staff and leave records only.
- Other staff: only assigned operational tasks and communications.

## Mandatory rule patterns before enabling a collection
1. Verify Firebase Auth identity and active user profile.
2. Verify the role and exact module grant.
3. Enforce record scope in Firestore Rules, not only in the UI.
4. For teacher access, verify an active teacherAssignments record for the requested class, section and subject.
5. For student access, compare the record student UID/ID with the signed-in user's approved student profile.
6. For parent access, require an active verified parentStudentLinks document linking the signed-in parent UID to the requested student.
7. For coordinator access, check explicit assigned scope documents.
8. Validate immutable identity and scope fields on create/update; prevent users changing their own role, status, studentId, parent links or ownerUid.
9. Restrict sensitive fields/collections such as fee, HR and discipline to explicitly authorised roles.
10. Add audit logging for marks publication, attendance corrections, fee receipts, user-role changes and discipline access.

## Current rules file
`/firestore.rules` is intentionally deny-by-default for all operational collections. It currently permits only tightly scoped user profile and system configuration access. This prevents the sample UI from accidentally becoming an unprotected live database. It is a baseline, not the finished collection-level policy.

## Current implementation status
- Role-specific dashboards: sample view implemented.
- Module catalogue: 33 modules.
- Common module prototype: sample rows, search, add/edit/delete/reset in current browser session.
- Persistent CRUD: not yet enabled.
- Operational collection rules: intentionally denied pending module-specific policies.
- Sample records: synthetic in-page examples; no Firestore seeding or real identities.
- Deployment: no Firebase rules deployment performed by this commit.
