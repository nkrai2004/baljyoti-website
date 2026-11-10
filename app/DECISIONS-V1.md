# Bal Jyoti School OS V1 — Locked Decisions

**Locked by project owner: 10 November 2026**

## Login
- Staff and authorised administrators use official school Google Workspace accounts.
- Students have individual accounts. The exact credential method (school Google account or student ID/password) remains an implementation decision.
- Parents use a verified identity. Parent account activation and child linking require authorised school approval.
- Authentication does not itself grant access: role, account status and record-level permissions are checked separately.

## WhatsApp
- Manual FOC-first sharing only through WhatsApp Business / click-to-chat links.
- School OS prepares message, recipient selection and share action; an authorised staff member confirms and sends in WhatsApp.
- No unofficial bots, browser automation or bulk extensions.
- A share action is not proof of delivery/read. Record only prepared/shared or manually marked-sent status, sender and timestamp.
- Paid WhatsApp Business Platform/API automation is out of V1 scope.

## Parent access
- Parent workspace is included in V1.
- One parent can be linked to multiple children.
- A parent can access only authorised linked children's approved information: notices, attendance, homework, timetable, results, fee details and school communication.
- Parent-child links and changes require authorised approval and audit logging.
- Internal staff notes and other students' records are not visible to parents.

## Architecture and security implications
- Five workspaces: Teacher, Student, Coordinator, Management and Parent.
- Shared services: User Management, Role & Permission Management, Communication Centre, academic master data, tasks, reports and audit logs.
- Enforce record-level Firestore rules for assigned classes/students and parent-child relationships.
- Test revoked access, multi-child links and account isolation before launch.
- Preserve main and live /erp1/ until staging and release approval.

## Still to confirm
- Student credential method.
- Parent email verification method and whether personal Gmail only or any verified email is accepted.
- Who in the school approves parent-child linking.
