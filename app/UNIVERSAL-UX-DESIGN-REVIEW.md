# Bal Jyoti School OS — Universal Experience Design Review

**Version:** 1.0  
**Review date:** 11 November 2026  
**Design brief reviewed:** Universal Experience & Conversational Design Master Prompt v2.0  
**Status:** Design review published; implementation not started  
**Repository:** `nkrai2004/baljyoti-website` · `main`

---

## 1. Executive assessment

**Overall design-brief score: 8.2/10 — strong direction, ready for detailed experience design, not yet ready for implementation.**

The v2.0 brief makes the right strategic shift: from a collection of menu-driven ERP modules to a role-aware school community and operating platform. Its strongest decisions are a consistent universal shell, five familiar destinations, a personalised home feed, work-linked conversations, contextual tasks, progressive disclosure and explicit privacy constraints.

The score evaluates the quality and completeness of the proposed design direction. It does **not** score a built or deployed product, and it is not evidence of WCAG conformance or successful user testing.

### Decision

Proceed to detailed information architecture, role journey maps and mobile/desktop wireframes. Do not begin the universal redesign implementation until those deliverables and the key decisions in section 6 have been reviewed and approved.

## 2. Scorecard

Scores assess the design proposal, not the current live implementation.

| Dimension | Score / 10 | Assessment |
|---|---:|---|
| Ease of use | 9.0 | Clear user-first product philosophy and familiar interaction patterns. Needs task-level validation. |
| Navigation simplicity | 8.5 | Five destinations are a strong simplification. Explore taxonomy and role-specific entry points need definition. |
| Mobile usability | 9.0 | Mobile-first direction and large touch controls are explicit. Responsive wireframes and device testing remain outstanding. |
| Accessibility | 8.5 | WCAG 2.2 AA target is explicit. Add detailed keyboard, screen-reader, focus, error and cognitive-accessibility acceptance criteria. |
| Conversational experience | 8.5 | Good guided workflow examples. Needs a clear boundary between chat, forms, tables and automated actions. |
| Information discovery | 8.0 | Feed, search and Explore are promising. Needs feed ranking, filters, content categories and search-scope rules. |
| Role personalisation | 9.0 | Strong role and responsibility model. Needs a formal content/permission matrix across every surface. |
| Visual consistency | 8.5 | Brand, spacing and component direction are clear. Needs complete design tokens and component states. |
| Task completion efficiency | 8.0 | Contextual actions and My Work can reduce navigation. No measured baseline or step-count targets yet. |
| Error prevention | 8.5 | Confirmation and guided flows are considered. Add undo, draft recovery, duplicate handling and exception paths. |
| Low-end device performance | 8.0 | Slow-network needs are recognised. Needs performance budgets, offline behaviour and feed/media loading rules. |
| Privacy and permission clarity | 9.0 | Strong privacy principles. Needs explicit data classification, conversation membership, notification and audit policies. |
| First-time learnability | 8.5 | Familiar patterns and simple language support learning. Needs onboarding and first-use usability tests. |
| Scalability to 2,000 students | 8.0 | Direction is plausible. Needs data-volume, query, pagination, concurrency and operational ownership design. |

**Arithmetic mean:** 8.5/10.  
**Readiness-adjusted overall score:** **8.2/10**, reflecting important unresolved architecture and validation decisions.

### Score interpretation

- **9–10:** Clear, testable and substantially specified.
- **7–8.9:** Strong direction; some design decisions or validation remain.
- **5–6.9:** Significant gaps require resolution.
- **Below 5:** Not ready for progression.

## 3. What is already strong

1. **One universal experience, different authorised workspaces.** This is the right distinction between consistent usability and role-specific access.
2. **Five-part navigation.** Home, Conversations, My Work, Explore and Profile are easier to understand than a large module menu.
3. **Feed plus task model.** Users can stay informed without confusing announcements with work that requires action.
4. **Conversational-first, not chat-only.** Keeping forms and tables where they are more efficient is essential for school operations.
5. **Role-aware personalisation.** Primary role, additional responsibilities, assigned classes and data scope are recognised as separate dimensions.
6. **Accessibility and mobile-first requirements.** These are product requirements, not optional polish.
7. **Staging and production safeguards.** The brief protects the existing production Firebase project and ERP1 application.
8. **Honest operational status.** The design explicitly prohibits claiming that a task is saved or complete before backend confirmation.

## 4. Improvements required before implementation

### P0 — Must resolve before wireframes are approved

#### A. Define the universal permission contract

Create one policy matrix covering every data surface:

- Home feed cards and attachments
- Search results and suggestions
- Direct messages and group membership
- Notifications and lock-screen previews
- My Work tasks and approvals
- Explore modules and deep links
- Conversational assistant context and generated answers
- Exports, downloads and shared links

A hidden menu item is not a security control. Enforce access in Firestore rules and trusted backend operations. Re-check permissions when opening a record or performing an action.

#### B. Define feed governance

Specify:
- Who can publish school-wide, class, department and individual updates.
- Who approves sensitive announcements.
- Feed ordering: chronological by default, with clearly labelled priority notices.
- Expiry, pinning, editing, deletion and correction rules.
- Audience preview before publishing.
- Attachment types, file size limits and accessibility requirements.
- Read/acknowledgement requirements for formal notices.

Do not use popularity, likes or engagement ranking to determine the importance of school information.

#### C. Define the conversation model

Before building chat, define:
- One-to-one, class, department, school announcement and work-thread types.
- Who can create groups, add/remove participants and manage membership.
- Parent-teacher communication boundaries and school moderation/escalation.
- Message editing, deletion, reporting and retention.
- Read receipts, delivery states, mute settings and notification preferences.
- Attachments, safe file handling and message search.
- Audit requirements for official school communications.

Do not promise real-time messaging until the backend, permissions and delivery behaviour exist.

#### D. Clarify the command assistant's limits

The command area must:
- Identify the user's role and authorised scope.
- Ask a clarifying question when class, date, recipient or record is ambiguous.
- Show a preview before sending, approving, publishing or changing records.
- Require explicit confirmation for consequential actions.
- Report success only after the backend confirms it.
- Provide a direct form/list fallback.
- Explain when it cannot perform an action.

### P1 — Must resolve during detailed design

#### E. Make My Work the operational source of truth

Define a common task model with:
- Task owner and creator.
- Related student, class, employee or module IDs where permitted.
- Due date, priority and status.
- Assignment scope and escalation path.
- Completion evidence and audit history.
- Draft, pending, blocked, failed and completed states.

Avoid duplicating the same task in several feeds or dashboards without a shared underlying task identity.

#### F. Define notification rules

Separate urgent alerts, actionable reminders and general updates. Provide user controls for frequency and channel. Avoid repeated alerts for the same event. Sensitive details must not appear in lock-screen previews or unauthorised notifications.

#### G. Define search and Explore

Search must explain its scope and return only authorised records. Explore should group services by user intent rather than expose the internal database/module catalogue. Include empty, no-access and no-results states.

#### H. Design for multilingual and varied literacy needs

Plan simple English and Hindi support, consistent date/time formats, readable labels, clear icons with text, and language-aware content. Do not rely on icon-only navigation.

#### I. Design resilient low-connectivity behaviour

Specify:
- Loading skeletons and progressive content.
- Retry and recoverable error states.
- Draft preservation for forms and messages.
- Offline read-only behaviour where safe.
- Clear distinction between queued, sent, saved and failed.
- Pagination and lazy loading for feeds and conversations.

Do not queue sensitive writes offline unless conflict resolution and secure storage are designed and approved.

### P2 — Optimise after the core model is proven

- Personalise quick actions using actual usage only where privacy-safe and explainable.
- Add saved filters and user-controlled feed preferences.
- Introduce optional shortcuts for experienced staff.
- Consider richer analytics only after trusted data and role-scoped reporting are operational.

## 5. Recommended product architecture

### Universal navigation

1. **Home:** personalised feed, announcements, My Day and contextual actions.
2. **Conversations:** direct messages, groups, official notices and work threads.
3. **My Work:** tasks, timetable, assignments, reminders and approvals.
4. **Explore:** authorised school services organised by purpose.
5. **Profile:** account, responsibilities, preferences, language and help.

The labels are provisional and should be tested with representative users.

### Super Admin control centre

Keep system configuration distinct from ordinary school work:

- School Setup
- People
- Academic Planning
- School Operations
- Access & Control
- Reports & Insights

Super Admin's Director/Principal preview must remain a clearly labelled view preview. It must not change the signed-in identity or imply full impersonation. Any future true simulation must have separately designed security and audit controls.

### Common interaction rules

- Every screen answers: Where am I? What can I do? What needs attention? What happens next?
- Primary actions are prominent and reachable.
- Use progressive disclosure for advanced options.
- Use a short guided flow for complex tasks, not a generic chatbot for everything.
- Preserve forms and tables when they are faster, more precise or easier to audit.
- Every operation has loading, success, failure, retry and permission-denied states.
- Distinguish demo, draft, queued, saved and server-confirmed states.

## 6. Decisions required before wireframe sign-off

| Decision | Recommended default |
|---|---|
| Feed ordering | Chronological, with a separate pinned priority area |
| School-wide publishing | Restricted authorised publishers; approval for designated sensitive notices |
| Parent-teacher messages | Verified child link, scoped communication and school-defined hours/escalation |
| Group creation | Role/assignment-based creation permissions |
| Read receipts | Optional for ordinary conversations; formal acknowledgement only for designated notices |
| Notification priority | Urgent, actionable and informational categories |
| AI action execution | Preview and explicit confirmation before consequential actions |
| Offline mode | Safe read-only access and recoverable drafts first |
| Languages | Simple English and Hindi; preserve original message language |
| Data retention | School-approved retention policy before messaging launch |

These are recommendations for approval, not existing system capabilities or confirmed school policies.

## 7. Wireframe deliverables to produce next

Design mobile and desktop variants for:

1. Universal Home — first-time and returning user.
2. Home feed — announcement, activity update, task card and empty state.
3. Conversations inbox — direct, group and work-linked threads.
4. Conversation detail — message, attachment, participant and safety states.
5. My Work — task list, calendar/timetable and approvals.
6. Explore — role-aware categories, search and restricted state.
7. Profile — primary role, additional responsibilities and preferences.
8. Teacher attendance — assigned class, student list, status, missing entries and confirmation.
9. Admission enquiry — guided intake, duplicate warning, assignment and confirmation.
10. Parent home — multiple verified children and child switching.
11. Principal overview — school priorities, exceptions and drill-down.
12. Super Admin control centre — system setup, people, access and role preview.

For every wireframe, include loading, empty, error, offline, denied, success and keyboard-focus states where relevant.

## 8. Usability and accessibility validation

### Representative test groups

- Teachers with different levels of digital confidence.
- Parents using lower-end Android phones.
- Students using mobile devices.
- Coordinators and administrators.
- Principal and Director.
- Super Admin.
- Participants with low vision, motor or reading accessibility needs where recruitment is possible.

### Proposed task success criteria

| Measure | Initial target |
|---|---:|
| First-time user identifies primary navigation | 90% |
| Teacher finds today's first class | 90% |
| Teacher completes attendance prototype accurately | 90% |
| Parent finds the correct linked child's update | 95% |
| User recognises whether an action is saved or pending | 95% |
| Critical unauthorised data exposure | 0 |
| Critical keyboard or screen-reader blocker | 0 |
| Common task completion without assistance | 85% |

These are proposed acceptance targets, not measured results. Record task completion, time, errors, assistance and user confidence. Test at 320, 360, 390, 768, 1024 and desktop widths; keyboard-only; screen reader; 200% zoom; reduced motion; slow network and recoverable failure.

### Accessibility acceptance

- WCAG 2.2 AA review, including focus visibility/obscuration, target size, labels, errors, status announcements, reflow and contrast.
- Product target of at least 44 × 44 CSS pixels for important touch controls.
- Normal text contrast at least 4.5:1; large text at least 3:1.
- No colour-only meaning.
- Persistent form labels and programmatically associated errors.
- Logical focus order and no keyboard traps.
- Screen-reader announcements for save, failure and status changes.
- Hindi and English content checked for text expansion and readable wrapping.

## 9. Phased implementation roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| 0. Design approval | IA, role journeys, permission matrix, wireframes and design tokens | Product owner approves scope and unresolved decisions |
| 1. Universal shell | Responsive navigation, route guard, profile and global states | Role-based access and all responsive states tested |
| 2. Home and feed | Announcements, My Day and contextual actions | Secure audience filtering, feed governance and clear status |
| 3. My Work | Tasks, schedule and approvals | Shared task identity, ownership and audit behaviour |
| 4. Conversations | Inbox, groups and work threads | Membership rules, retention, moderation and notification tests |
| 5. Explore and workflows | Admissions, attendance, academic and administrative journeys | Backend persistence and record-level security tested |
| 6. Conversational assistance | Permission-aware guided commands | Confirmation, ambiguity, refusal and recovery tests |
| 7. Release readiness | Accessibility, performance, privacy and role QA | Staging sign-off and verified deployment |

Each phase must use synthetic staging data until record-level security and operational persistence have been tested and approved.

## 10. Existing application constraints and implementation safeguards

The repository review confirms the following constraints:

- School OS changes go directly to `main`.
- Deployment target is `https://baljyoti.com/app/`.
- Preserve `/erp1/` and production Firebase project `baljyoti-erp`.
- Use staging project `baljyoti-school-os-staging` for approved development and testing.
- Existing authentication, user profiles, role/module access, functional responsibilities and Master Data relationships must be preserved or deliberately migrated with review.
- Existing operational screens include prototype/local-demo behaviour. Do not describe them as persistent functionality.
- Firestore UI checks are not security boundaries; record-level security must be enforced and tested in Firestore rules/backend operations.
- Do not expose Google Sheets links to ordinary school users.
- Do not import real student/parent/employee records before schema, permissions and data handling are approved.
- No code, Firebase configuration or deployment changes are made by this design review.

## 11. Final recommendation

**Approve the direction, but not implementation yet.**

The universal social-and-conversational concept is strong. Its success depends on treating permissions, feed governance, conversation safety, task identity and low-connectivity behaviour as core product architecture—not later enhancements.

The next milestone is to produce and review the universal Home, Conversations and My Work wireframes together with the permission/content matrix. Once those are approved, the rest of the role-specific experience can follow a consistent design language.

**Product principle:** Teacher teaches. Student learns. Parent connects. Coordinator enables. Principal leads. Director guides. Super Admin controls. The system connects everyone.
