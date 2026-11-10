# Demo account identities — staging only

All demo identities are visibly marked with **Demo** and every login email ends in `.demo@baljyoti.com`. Stable demo IDs end in `-DEMO`.

## Proposed demo accounts

| Display name | Login email | Role |
|---|---|---|
| Principal Demo | principal.demo@baljyoti.com | principal |
| Academic Coordinator Demo | coordinator.demo@baljyoti.com | academic_coordinator |
| Teacher Demo | teacher.demo@baljyoti.com | teacher |
| Accountant Demo | accountant.demo@baljyoti.com | accountant |
| Student Demo | student.demo@baljyoti.com | student |
| Parent Demo | parent.demo@baljyoti.com | parent |

Synthetic student: `DEMO-26001`. Parent-child mapping must be explicitly verified in staging.

## What is ready
- `accounts.js` contains the demo identity manifest and stable role mapping.
- All labels and sample records are marked Demo.
- No real school users or records are modified.

## What must happen before login works
1. A Google Workspace administrator must create these six test identities (or confirm that the addresses already exist) in the school Workspace.
2. Each identity must sign in once to the **staging** app so Firebase Authentication creates its UID.
3. Super Admin must create/activate the matching `users/{uid}` profile using the exact email, role and accountType in `accounts.js`.
4. Verify the parent-child link using only the synthetic student record.
5. Test each account's allowed and denied access.

The GitHub repository integration cannot create Google Workspace users or Firebase Authentication identities. This manifest deliberately does not create fake login accounts, passwords, or Firestore profiles without real Auth UIDs. Do not create these identities in the production project and do not deploy operational rules to production.
