# AARIKA Firebase Setup

This document is the controlled setup path for the real AARIKA Firebase environment.

## 1. Create the Firebase project
Create a dedicated Firebase project for AARIKA. Do not use a personal/demo project for production.

Recommended project ID pattern: `aarika-school-erp-prod`

## 2. Add the Web App
Firebase Console → Project settings → Your apps → Web app. Register AARIKA and copy its Web App configuration into `app/firebase-config.js`.

The Firebase Web configuration is client-side configuration, not a password. Never commit Firebase Admin service-account private keys, GitHub tokens, or OAuth client secrets.

## 3. Enable Google Authentication
Firebase Console → Authentication → Sign-in method → Google → Enable.

## 4. Authorised domains and OAuth origins
Add `localhost` for development and `aarika.baljyoti.com` for production to Firebase Authentication authorised domains. The Google OAuth client must also have the exact JavaScript origins configured in Google Cloud Console.

## 5. Create Firestore
Create the Firestore database in the production region selected for AARIKA. Deploy `firestore.rules` before allowing real school data.

## 6. First production records
Create one platform administrator, one school, and one school administrator through a controlled admin flow. Do not hard-code real users in JavaScript.

## 7. Deployment credentials
Never commit Firebase Admin SDK service-account JSON, GitHub personal access tokens, private keys, or OAuth client secrets. Use GitHub Actions secrets for deployment credentials.
