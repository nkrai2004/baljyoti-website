# Bal Jyoti School OS — V1

Development-only School OS foundation for Bal Jyoti Public School.

## Workspaces
- Teacher
- Student
- Coordinator
- Management
- Parent (included in V1)

## Locked decisions (10 November 2026)
1. Staff/authorised administrator sign-in: official school Google Workspace accounts.
2. Student accounts: individual accounts; credential mechanism to be finalised during identity setup.
3. Parent accounts: verified identity, school-approved parent-child links, including multiple children per parent.
4. WhatsApp: manual sharing through WhatsApp Business / click-to-chat links. No paid API automation or unofficial bots in V1.
5. Parent workspace is included in V1.

See DECISIONS-V1.md for implementation and security implications.

## Current contents
- index.html: responsive five-workspace dashboard preview.
- DECISIONS-V1.md: locked product decisions.

## Preview
Open index.html in a browser. This is a static preview. All numbers, timetables and notices are illustrative demo content.

## Important limitations
- No Firebase authentication or Firestore data connection is implemented.
- Dashboard action buttons are preview placeholders.
- No Gmail API, Google Classroom API or WhatsApp API integration is connected.
- Parent dashboard is a concept preview, not live student/parent data.
- Official logo is referenced from the existing repository logo.png; it is not recreated.

## Deployment path
Repository: nkrai2004/baljyoti-website
Branch: baljyoti-school-os-v1
Folder: app/
Target URL after approved deployment: https://baljyoti.com/app/

## Production safety
Do not merge to main, modify /erp1/, or change production Firebase rules until the existing data/authentication model is audited, record-level permissions are implemented and tested, and a backup/rollback plan is approved.
