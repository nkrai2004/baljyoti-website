# AARIKA Firebase Backend Setup

This package is **Firebase-ready** but cannot connect until a Firebase Web App is created.

## 1. Create Firebase project

Open Firebase Console and create a project for AARIKA.

Suggested project name:
`aarika-baljyoti`

## 2. Add a Web App

Firebase Console:
Project Overview -> Add app -> Web

Copy the Firebase Web configuration.

Open:

`aarika/js/firebase-config.js`

Replace all `REPLACE_ME` values.

## 3. Enable Google Authentication

Firebase Console:
Authentication -> Sign-in method -> Google -> Enable

Set the authorised domain:

`baljyoti.com`

Also ensure the OAuth configuration used by your Google project allows:

`https://www.baljyoti.com`

## 4. Create Firestore

Firestore Database -> Create database.

Use production mode and deploy the supplied:

`firebase/firestore.rules`

## 5. Data model

### schools/{schoolId}

Example:

{
  "name": "Bal Jyoti Public School",
  "code": "BJPS",
  "city": "Noida",
  "status": "ACTIVE",
  "adminName": "School Admin",
  "adminEmail": "admin@baljyoti.com",
  "createdAt": "ISO timestamp"
}

### users/{userId}

Recommended production fields:

{
  "email": "admin@baljyoti.com",
  "name": "School Admin",
  "role": "SCHOOL_ADMIN",
  "schoolId": "school document ID",
  "status": "ACTIVE"
}

## 6. Important security point

Do NOT make the browser decide who is Super Admin in production.

Super Admin must be controlled using Firebase Authentication + custom claims, for example:

`superAdmin: true`

The Firestore rules in this package already demonstrate that pattern.

## 7. GitHub Pages

The Firebase JavaScript SDK runs from the browser, so the frontend can continue to be hosted at:

https://www.baljyoti.com/aarika/

GitHub Pages does not need to become the backend.

Architecture:

GitHub Pages
    |
    v
AARIKA HTML/CSS/JS
    |
    +--> Firebase Authentication
    |
    +--> Cloud Firestore
    |
    +--> Firebase Security Rules

## 8. Current status

Login UI: working
Role routing: working
Super Admin Schools UI: working
Demo storage: working
Firebase adapter: ready
Firestore security rules: ready
Production role claims: pending Firebase project setup
