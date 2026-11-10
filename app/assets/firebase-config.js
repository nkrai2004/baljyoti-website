// Development safety: configure ONLY a separate Firebase staging project here.
// Never paste the production baljyoti-erp configuration into this file.
window.BJ_FIREBASE_CONFIG = {
  apiKey: "REPLACE_WITH_STAGING_API_KEY",
  authDomain: "REPLACE_WITH_STAGING_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_STAGING_PROJECT",
  storageBucket: "REPLACE_WITH_STAGING_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_STAGING_SENDER_ID",
  appId: "REPLACE_WITH_STAGING_APP_ID"
};
// After the designated Super Admin signs into the staging project once,
// copy that staging Firebase UID here. Never use the production-project UID.
window.BJ_SUPER_ADMIN_UID = "REPLACE_WITH_STAGING_SUPER_ADMIN_UID";