# AARIKA Production Deployment

## Current state

The repository contains the application, Firebase bootstrap, Firestore rules, domain models, CI foundation, bilingual UI foundation, and AI/agent boundaries.

## Required before production

1. Create/select the production Firebase project.
2. Enable Authentication and Google provider.
3. Enable Firestore.
4. Register the production web app and place its public Firebase Web configuration in `app/firebase-config.js`.
5. Configure the authorised `baljyoti.com` domain in Firebase Authentication and Google Cloud OAuth settings.
6. Deploy Firebase Hosting using `firebase.json`.
7. Point `aarika.baljyoti.com` DNS to Firebase Hosting.
8. Run the production smoke-test checklist before opening access to school users.

## Security rule

No Firebase service-account key, private API key, model secret, or other server credential belongs in this repository.
