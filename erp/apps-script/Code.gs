/**
 * BJPS-ERP shared Apps Script foundation.
 * Fail-closed database access and role/permission authorization.
 *
 * Required Script Properties:
 * BJPS_ERP_FILE_01_BJPS_ERP_Core_Master ... BJPS_ERP_FILE_14_BJPS_ERP_Dashboard_MIS
 * BJPS_FIREBASE_WEB_API_KEY
 */
const BJPS_DATABASES = Object.freeze({
  CORE_MASTER: 'BJPS_ERP_FILE_01_BJPS_ERP_Core_Master',
  STUDENT_DATABASE: 'BJPS_ERP_FILE_02_BJPS_ERP_Student_Database',
  STAFF_DATABASE: 'BJPS_ERP_FILE_03_BJPS_ERP_Staff_Database',
  USER_ACCESS: 'BJPS_ERP_FILE_04_BJPS_ERP_User_Access',
  ADMISSION_DATABASE: 'BJPS_ERP_FILE_05_BJPS_ERP_Admission_Database',
  ACADEMIC_DATABASE: 'BJPS_ERP_FILE_06_BJPS_ERP_Academic_Database',
  ACTIVITY_DATABASE: 'BJPS_ERP_FILE_07_BJPS_ERP_Activity_Database',
  FINANCE_DATABASE: 'BJPS_ERP_FILE_08_BJPS_ERP_Finance_Database',
  HR_DATABASE: 'BJPS_ERP_FILE_09_BJPS_ERP_HR_Database',
  PROCUREMENT_INVENTORY: 'BJPS_ERP_FILE_10_BJPS_ERP_Procurement_Inventory',
  TRANSPORT_DATABASE: 'BJPS_ERP_FILE_11_BJPS_ERP_Transport_Database',
  ADMIN_OPERATIONS: 'BJPS_ERP_FILE_12_BJPS_ERP_Admin_Operations',
  WORKFLOW_AUDIT: 'BJPS_ERP_FILE_13_BJPS_ERP_Workflow_Audit',
  DASHBOARD_MIS: 'BJPS_ERP_FILE_14_BJPS_ERP_Dashboard_MIS'
});

const BJPS_RBAC = Object.freeze({
  DATABASE_KEY: 'USER_ACCESS',
  TABLES: Object.freeze({
    USERS: 'ERP_USER_MASTER',
    ASSIGNMENTS: 'ERP_USER_ROLE_ASSIGNMENTS',
    ROLES: 'ERP_ROLE_MASTER',
    PERMISSIONS: 'ERP_ROLE_PERMISSIONS'
  })
});

function getBJPSERPSheet(databaseKey, tableName) {
  const propertyName = BJPS_DATABASES[String(databaseKey || '').trim()];
  if (!propertyName) throw new Error('Unknown BJPS ERP database key: ' + databaseKey);
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(propertyName);
  if (!spreadsheetId) throw new Error('Missing Script Property: ' + propertyName);
  const spreadsheet = SpreadsheetApp.openById(String(spreadsheetId).trim());
  const requested = String(tableName || '').trim();
  let sheet = spreadsheet.getSheetByName(requested);
  const aliases = BJPS_SHEET_ALIASES_[requested] || [];
  for (let i = 0; i < aliases.length && !sheet; i++) sheet = spreadsheet.getSheetByName(aliases[i]);
  if (!sheet) throw new Error('Required sheet "' + requested + '" was not found in database "' + databaseKey + '".');
  return sheet;
}

const BJPS_SHEET_ALIASES_ = Object.freeze({
  ERP_USER_MASTER: ['ERP_USERS','USER_MASTER','USERS'],
  ERP_USER_ROLE_ASSIGNMENTS: ['ERP_USER_ROLE_ASSIGNMENT','USER_ROLE_ASSIGNMENTS','ROLE_ASSIGNMENTS'],
  ERP_ROLE_MASTER: ['ERP_ROLES','ROLE_MASTER','ROLES'],
  ERP_ROLE_PERMISSIONS: ['ERP_ROLE_PERMISSION_GRANTS','ERP_ROLE_PERMISSION','ROLE_PERMISSION_GRANTS','ROLE_PERMISSIONS','PERMISSION_GRANTS']
});

function bjpsGetHeaderMap_(sheet) {
  if (!sheet || sheet.getLastColumn() < 1 || sheet.getLastRow() < 1) throw new Error('RBAC sheet is empty or has no header row.');
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0];
  const map = {};
  headers.forEach(function(value,index) {
    const key = String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
    if (key) map[key] = index;
  });
  return map;
}
function bjpsFindColumn_(map, aliases, required) {
  for (let i=0;i<aliases.length;i++) {
    const key=String(aliases[i]).toLowerCase().replace(/[^a-z0-9]/g,'');
    if (map[key] !== undefined) return map[key];
  }
  if (required) throw new Error('RBAC schema missing required column: ' + aliases[0]);
  return -1;
}
function bjpsCell_(row,index) { return index < 0 ? '' : row[index]; }
function bjpsIsActive_(value) {
  if (value === true || value === 1) return true;
  return ['ACTIVE','TRUE','YES','1','ENABLED'].indexOf(String(value || '').trim().toUpperCase()) >= 0;
}
function bjpsDateAllows_(start,end,now) {
  if (start && !isNaN(new Date(start).getTime()) && new Date(start) > now) return false;
  if (end && !isNaN(new Date(end).getTime()) && new Date(end) < now) return false;
  return true;
}

/** Explicit server-side authorization. Missing grants and unsupported scopes deny access. */
function authorizeBJPSERPRequest_(idToken, permissionCode, scope) {
  const identity = verifyBJPSFirebaseIdToken(idToken);
  if (!identity || identity.authenticated !== true || identity.disabled === true || !identity.uid) throw bjpsFoundationError_('AUTH_FAILED','Authentication could not be verified.');
  const email = String(identity.email || '').trim().toLowerCase();
  if (identity.emailVerified !== true || !email.endsWith('@baljyoti.com')) throw bjpsFoundationError_('SCHOOL_ACCOUNT_REQUIRED','A verified school account is required.');

  const users = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES.USERS);
  const userValues = users.getDataRange().getValues();
  const uh = bjpsGetHeaderMap_(users);
  const uUid = bjpsFindColumn_(uh,['FirebaseUID','UID'],true);
  const uEmail = bjpsFindColumn_(uh,['Email'],true);
  const uStatus = bjpsFindColumn_(uh,['AccountStatus','Status'],true);
  const user = userValues.slice(1).find(function(row) {
    return String(bjpsCell_(row,uUid) || '').trim() === String(identity.uid).trim() &&
      String(bjpsCell_(row,uEmail) || '').trim().toLowerCase() === email &&
      String(bjpsCell_(row,uStatus) || '').trim().toUpperCase() === 'ACTIVE';
  });
  if (!user) throw bjpsFoundationError_('ERP_ACCOUNT_INACTIVE','An active ERP user account is required.');

  const assignmentSheet = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES.ASSIGNMENTS);
  const assignmentRows = assignmentSheet.getDataRange().getValues();
  const ah = bjpsGetHeaderMap_(assignmentSheet);
  const aUid = bjpsFindColumn_(ah,['FirebaseUID','UserFirebaseUID','UID'],true);
  const aRole = bjpsFindColumn_(ah,['RoleCode','RoleID'],true);
  const aStart = bjpsFindColumn_(ah,['EffectiveFrom','StartDate'],false);
  const aEnd = bjpsFindColumn_(ah,['EffectiveTo','EndDate'],false);
  const aActive = bjpsFindColumn_(ah,['IsActive','AssignmentStatus','Status'],true);

  const roleSheet = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES.ROLES);
  const roleRows = roleSheet.getDataRange().getValues();
  const rh = bjpsGetHeaderMap_(roleSheet);
  const rCode = bjpsFindColumn_(rh,['RoleCode','Code'],true);
  const rActive = bjpsFindColumn_(rh,['IsActive','Status'],true);
  const now = new Date();
  const activeRoleCodes = assignmentRows.slice(1).filter(function(row) {
    return String(bjpsCell_(row,aUid) || '').trim() === String(identity.uid).trim() &&
      bjpsIsActive_(bjpsCell_(row,aActive)) &&
      bjpsDateAllows_(bjpsCell_(row,aStart),bjpsCell_(row,aEnd),now);
  }).map(function(row) { return String(bjpsCell_(row,aRole) || '').trim().toUpperCase(); }).filter(Boolean);
  const validRoles = roleRows.slice(1).filter(function(row) {
    return activeRoleCodes.indexOf(String(bjpsCell_(row,rCode) || '').trim().toUpperCase()) >= 0 &&
      bjpsIsActive_(bjpsCell_(row,rActive));
  }).map(function(row) { return String(bjpsCell_(row,rCode) || '').trim().toUpperCase(); });
  if (!validRoles.length) throw bjpsFoundationError_('ROLE_NOT_ASSIGNED','No active ERP role is assigned to this account.');

  if (!scope || String(scope.type || '').trim().toUpperCase() !== 'GLOBAL' || String(scope.id || '').trim()) {
    throw bjpsFoundationError_('SCOPE_NOT_SUPPORTED','This API currently permits only explicitly granted GLOBAL scope.');
  }
  const permissionSheet = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES.PERMISSIONS);
  const permissionRows = permissionSheet.getDataRange().getValues();
  const ph = bjpsGetHeaderMap_(permissionSheet);
  const pRole = bjpsFindColumn_(ph,['RoleCode','RoleID'],true);
  const pCode = bjpsFindColumn_(ph,['PermissionCode','Permission'],true);
  const pScope = bjpsFindColumn_(ph,['ScopeType','Scope'],true);
  const pActive = bjpsFindColumn_(ph,['IsActive','GrantStatus','Status'],true);
  const pAllowed = bjpsFindColumn_(ph,['IsAllowed','Allowed'],false);
  const wanted = String(permissionCode || '').trim().toUpperCase();
  const granted = permissionRows.slice(1).some(function(row) {
    return validRoles.indexOf(String(bjpsCell_(row,pRole) || '').trim().toUpperCase()) >= 0 &&
      String(bjpsCell_(row,pCode) || '').trim().toUpperCase() === wanted &&
      String(bjpsCell_(row,pScope) || '').trim().toUpperCase() === 'GLOBAL' &&
      bjpsIsActive_(bjpsCell_(row,pActive)) &&
      (pAllowed < 0 || bjpsIsActive_(bjpsCell_(row,pAllowed)));
  });
  if (!granted) throw bjpsFoundationError_('PERMISSION_DENIED','The required permission has not been granted: ' + wanted + '.');
  return {authorized:true,uid:identity.uid,roleCodes:validRoles,permissionCode:wanted,scope:'GLOBAL'};
}
function bjpsFoundationError_(code,message) {
  const error = new Error(message);
  error.apiCode = code;
  return error;
}

/** Read-only check; never creates, clears or changes school data. */
function diagnoseBJPSERPFoundation() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const report = {databases:{},rbacSheets:{},firebaseApiKeyConfigured:Boolean(properties.BJPS_FIREBASE_WEB_API_KEY)};
  Object.keys(BJPS_DATABASES).forEach(function(key) { report.databases[key] = Boolean(properties[BJPS_DATABASES[key]]); });
  ['USERS','ASSIGNMENTS','ROLES','PERMISSIONS'].forEach(function(key) {
    try {
      const sheet = getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES[key]);
      report.rbacSheets[key] = {found:true,name:sheet.getName(),lastRow:sheet.getLastRow(),headers:sheet.getLastColumn() ? sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0] : []};
    } catch (error) { report.rbacSheets[key] = {found:false,error:String(error.message || error)}; }
  });
  Logger.log(JSON.stringify(report,null,2));
  return report;
}
