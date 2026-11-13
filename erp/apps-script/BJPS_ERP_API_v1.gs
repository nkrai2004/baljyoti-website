/**
 * BJPS-ERP API v1 — restricted session bootstrap.
 * Add this as a NEW .gs file to the existing Apps Script project.
 * This API deliberately exposes no arbitrary spreadsheet read/write action.
 */
const BJPS_API_V1 = Object.freeze({
  VERSION: '1.0.0',
  MAX_BODY_CHARS: 16000,
  ALLOWED_DOMAIN: 'baljyoti.com',
  ACTIONS: Object.freeze(['session.bootstrap'])
});

function doGet() {
  return bjpsApiJson_({success:true, service:'BJPS-ERP API', version:BJPS_API_V1.VERSION, status:'online'});
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? String(e.postData.contents) : '';
    if (!raw || raw.length > BJPS_API_V1.MAX_BODY_CHARS) throw bjpsApiError_('INVALID_REQUEST','Request body is missing or too large.');
    const request = JSON.parse(raw);
    if (!request || typeof request !== 'object' || Array.isArray(request)) throw bjpsApiError_('INVALID_REQUEST','A JSON object is required.');
    if (String(request.action || '').trim() !== 'session.bootstrap') throw bjpsApiError_('ACTION_NOT_ALLOWED','This API action is not available.');
    return bjpsApiJson_({success:true, data:bjpsApiSessionBootstrap_(request.idToken)});
  } catch (error) {
    const code = error && error.apiCode ? error.apiCode : 'REQUEST_FAILED';
    const message = error && error.apiCode ? error.message : 'The request could not be completed. Check the API deployment and server logs.';
    console.error('BJPS API v1 failure [' + code + ']: ' + String(error && error.stack || error));
    return bjpsApiJson_({success:false, error:{code:code, message:message}});
  }
}

function bjpsApiSessionBootstrap_(idToken) {
  if (!idToken || typeof idToken !== 'string' || idToken.length > 12000) throw bjpsApiError_('AUTH_REQUIRED','A valid Firebase ID token is required.');
  const identity = verifyBJPSFirebaseIdToken(idToken);
  if (!identity || identity.authenticated !== true) throw bjpsApiError_('AUTH_FAILED','Authentication could not be verified.');
  if (identity.emailVerified !== true) throw bjpsApiError_('EMAIL_NOT_VERIFIED','Verify your school Google account email before continuing.');
  const email = String(identity.email || '').trim().toLowerCase();
  if (!email || !email.endsWith('@' + BJPS_API_V1.ALLOWED_DOMAIN)) throw bjpsApiError_('SCHOOL_ACCOUNT_REQUIRED','Use your official @baljyoti.com account.');

  const userValues = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY, BJPS_RBAC.TABLES.USERS).getDataRange().getValues();
  if (userValues.length < 2) return {accountStatus:'NOT_PROVISIONED', email:email, roleCodes:[]};
  const headers = userValues[0].map(h => String(h || '').trim());
  const col = {};
  headers.forEach((h,i) => {col[h]=i;});
  ['FirebaseUID','Email','DisplayName','AccountStatus'].forEach(name => {
    if (col[name] === undefined) throw bjpsApiError_('SERVER_CONFIGURATION','ERP user master is missing a required field.');
  });
  const userRow = userValues.slice(1).find(row => String(row[col.FirebaseUID] || '').trim() === String(identity.uid || '').trim());
  if (!userRow) return {accountStatus:'NOT_PROVISIONED', email:email, roleCodes:[]};
  if (String(userRow[col.Email] || '').trim().toLowerCase() !== email) throw bjpsApiError_('IDENTITY_MISMATCH','The Firebase email does not match the ERP user record.');
  const accountStatus = String(userRow[col.AccountStatus] || '').trim().toUpperCase();
  if (accountStatus !== 'ACTIVE') return {accountStatus:accountStatus || 'PENDING', email:email, roleCodes:[]};

  const assignments = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY, BJPS_RBAC.TABLES.ASSIGNMENTS).getDataRange().getValues();
  const roles = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY, BJPS_RBAC.TABLES.ROLES).getDataRange().getValues();
  const now = new Date();
  const activeRoles = {};
  assignments.slice(1).forEach(row => {
    if (String(row[1] || '').trim() !== String(identity.uid || '').trim() || row[8] !== true) return;
    if (row[6] && new Date(row[6]) > now) return;
    if (row[7] && new Date(row[7]) < now) return;
    const code = String(row[2] || '').trim().toUpperCase();
    const active = roles.slice(1).some(role => String(role[1] || '').trim().toUpperCase() === code && role[4] === true);
    if (code && active) activeRoles[code] = true;
  });
  const roleCodes = Object.keys(activeRoles).sort();
  return {
    accountStatus:'ACTIVE',
    email:email,
    displayName:String(userRow[col.DisplayName] || identity.displayName || ''),
    erpUserId:col.ERPUserID === undefined ? '' : String(userRow[col.ERPUserID] || ''),
    roleCodes:roleCodes,
    accessStatus:roleCodes.length ? 'ROLE_ASSIGNED' : 'ROLE_PENDING'
  };
}

function bjpsApiJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
function bjpsApiError_(code,message) {
  const error = new Error(message);
  error.apiCode = code;
  return error;
}
