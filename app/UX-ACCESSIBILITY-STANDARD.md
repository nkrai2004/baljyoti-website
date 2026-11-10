# Bal Jyoti School OS — UX & Accessibility Standard v1.0

## Design intent
A user-first school operating system. Each person should know: where am I, what can I do, what needs attention, what happens next, and whether my action succeeded.

## Benchmark references
- WCAG 2.2 AA (W3C): accessible names, semantic structure, keyboard access, visible focus, contrast, reflow, labels/instructions, error identification, status messages, minimum target size.
- UX4G Design Guidelines (Government of India): mobile-first, responsive design, user flows, usability, accessibility, trust, personalization and testing.
- HFI / ISO 9241 human-centred design principles: suitability for task, self-descriptiveness, conformity with expectations, suitability for learning, controllability, error tolerance and individualization.
- Nielsen Norman Group mobile usability research: clear navigation, touch targets, readable content, focused forms, search/filter usability, feedback and recovery.
- Material Design 3 and Apple Human Interface Guidelines: adaptive navigation, platform familiarity, hierarchy, consistency, user agency, privacy and clear feedback.

## Role-first information architecture
- Super Admin: system health, user lifecycle, role/module access, audit and configuration.
- Director: school-wide outcomes, approvals, finance/HR oversight and exceptions.
- Principal: academic quality, attendance, teaching, assessment and school operations.
- Coordinators: only their assigned classes/departments, pending work and escalations.
- Teachers: today's timetable, assigned classes, attendance, lesson plan, homework, assessments and student support.
- Students: today's learning, homework, timetable, attendance and published progress.
- Parents: linked children, attendance, homework, published results, fee status and school notices.

## Interaction requirements
1. Mobile-first responsive layout; no page-level horizontal scrolling at 320 CSS px. Data tables may use a labelled horizontal scroll region or a mobile card/list alternative.
2. Touch controls target at least 44×44 CSS px as the product baseline (WCAG 2.2 AA minimum is 24×24 CSS px with exceptions; UX4G Indian guidance references 9×9 mm).
3. Keyboard: all actions reachable, logical focus order, visible focus, no keyboard trap, focus not hidden by sticky headers.
4. Text: plain language, clear headings, labels, inline help, readable line height and zoom/reflow support.
5. Forms: persistent labels, correct input types, required/optional distinction, inline validation, preserve entered values after errors, prevent duplicate submission, show saving/success/failure states.
6. Feedback: every save/action announces a clear result; loading, empty, offline, permission denied and error states are designed.
7. Navigation: consistent header, clear current location, dashboard/home path, predictable back behaviour; mobile navigation prioritises frequent actions.
8. Safety: confirm destructive actions, offer undo/correction where appropriate, show scope and consequences, record audit history.
9. Privacy: show only records needed for the current role; UI restrictions never replace Firestore Security Rules.
10. Performance: avoid unnecessary dependencies, large initial payloads and blocking UI; preserve low-bandwidth usability.
11. Localization: school-local dates (Asia/Kolkata), INR formatting, simple English first; provide Hindi where school workflows require it.
12. Trust: distinguish demo data from live data; do not present invented/sample metrics as actual school performance.

## Design tokens
- Brand: official Bal Jyoti red and white. Red is reserved for primary actions and important identity; not every panel should be red.
- Typography: system font stack; body 16px baseline; clear hierarchy.
- Spacing: consistent 4/8px rhythm.
- Controls: 44px minimum height baseline, rounded corners, visible focus.
- Surfaces: neutral background, white content surfaces, restrained shadows and borders.
- Motion: subtle and disabled/reduced when user prefers reduced motion.

## Release gates (must be tested, not assumed)
- Test 320px, 360px, 390px, 768px, 1024px and desktop widths.
- Test Chrome Android, Safari iOS where available, desktop Chrome/Edge.
- Keyboard-only pass; screen-reader labels/status announcement pass.
- WCAG contrast audit for text, controls, focus and states.
- 200% zoom/reflow; orientation change; reduced-motion preference.
- Complete key journeys with each of the seven personas and test denied access.
- Test loading, empty, slow network, offline, expired session, validation and server errors.
- Verify every create/edit/approve action persists after refresh before calling the feature functional.
- Record defects and retest after fixes.

## Current implementation note
The shared stylesheet establishes a baseline and improves the existing screens. It does not prove WCAG conformance or make prototype modules operational. Formal conformance requires manual and automated accessibility testing plus task-based usability testing with representative school users.

## Applied screen coverage (10 November 2026)
The shared stylesheet `assets/design-system.css` is linked from:
- `login.html`
- `dashboard.html` (all role dashboards, including Super Admin)
- `teacher/index.html`
- `teacher/class-register.html`
- `modules/index.html` (shared module workflow)
- `user-management/index.html`
- `user-management/access.html`
- `user-management/install-role-mapping.html`
- `preview.html`

## Bal Jyoti brand application
- Primary school red: `#A71920` (existing School OS brand token).
- White: `#FFFFFF` for primary surfaces and controls.
- Ink: `#20232B`; neutral background: `#F5F6F8`.
- Keep the existing official school logo asset; do not redraw or replace it.
- Use red selectively for primary actions, active states and school identity; retain white/neutral surfaces for readability.

## Verification record
- Repository source check confirms all nine listed pages link to the shared stylesheet on `main`.
- Responsive rules, focus states, touch-control sizing and reduced-motion support are present in the shared CSS.
- Not yet verified: rendered screenshots at each viewport, browser/device behaviour, keyboard/screen-reader journeys, automated WCAG scan, contrast measurement for every state, and end-to-end role workflows. These require running the deployed site and real browser/device testing; do not represent the current code review as a pass.

## Dashboard redesign — 10 November 2026
- Rebuilt `dashboard.html` as a mobile-first, role-aware landing page.
- One consistent page model: school identity, greeting and role, quick actions, permitted workspace modules, role-specific guidance.
- Removed illustrative attendance, fee, enrolment and academic KPI figures from the dashboard. No operational metrics are presented until connected to verified live data.
- Quick actions are selected from each role's approved module grants; the Super Admin sees system administration shortcuts through the role catalogue.
- Added a compact mobile bottom navigation, responsive action cards, semantic headings, skip link, live loading status, explicit access/error state, and reduced-motion support.
- Brand use: Bal Jyoti red `#A71920` for primary actions and active emphasis; white surfaces; dark ink `#20232B`; neutral background `#F5F6F8`. Existing official logo is referenced from the root asset.

### Dashboard QA still required
- Render and test at 320, 360, 390, 768, 1024 and desktop widths.
- Confirm the deployed root logo path and dashboard links under GitHub Pages.
- Test each role account and verify quick actions exactly match Firestore grants.
- Test keyboard-only, screen reader, 200% zoom, high contrast and reduced motion.
- Confirm sign-out, expired session, offline, permission-denied and missing-role states.
- Validate all linked module routes and Firestore rules before real school data is enabled.

Source changes do not constitute a completed device or WCAG audit. The dashboard is a role-aware navigation surface; operational metrics and pending-work feeds remain to be connected to secure live data.
