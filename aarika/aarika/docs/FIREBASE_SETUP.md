# AARIKA Firebase Setup

This document is the controlled hand-off between the AARIKA codebase and the live Firebase project.

## 1. Firebase project

Create or select the production Firebase project for AARIKA.

## 2. Web application

Register a Web App and copy its Firebase Web configuration into:

`app/firebase-config.js`

Required fields:

- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

The web configuration is client-side configuration. Do not place service-account private keys in the repository.

## 3. Authentication

Enable **Google** under Firebase Authentication → Sign-in method.

Add these authorised domains:

- `aarika.baljyoti.com`
- the Firebase hosting domain used during initial testing
- `localhost` for local development, if required

The application itself additionally restricts authenticated accounts to `@baljyoti.com`.

## 4. Firestore

Create the production Firestore database and deploy `firestore.rules` before allowing real school data.

The first production collections are:

- `users`
- `schools`
- `schoolSettings`

All future school-owned collections must carry a `schoolId` and be protected by tenant-aware rules.

## 5. Production domain

Point `aarika.baljyoti.com` to Firebase Hosting after the application passes authentication and security testing.

## 6. Security rule

Never solve an authentication or authorization problem by putting credentials, service-account keys, or unrestricted Firestore rules in the client application.
