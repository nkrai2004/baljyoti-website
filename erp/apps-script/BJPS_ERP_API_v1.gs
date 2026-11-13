/**
 * BJPS-ERP API v1 — restricted session bootstrap.
 * Add this as a NEW .gs file to the existing Apps Script project.
 * This API deliberately exposes no arbitrary spreadsheet read/write action.
 */
const BJPS_API_V1 = Object.freeze({
  VERSION: '1.0.0',
  MAX_BODY_CHARS: 16000,
  ALLOWED_DOMAIN: 'baljyoti.com',
  ACTIONS: Object.freeze(['session.bootstrap','admission.enquiries.list','admission.enquiries.create'])
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
    const action = String(request.action || '').trim();
    let data;
    if (action === 'session.bootstrap') data = bjpsApiSessionBootstrap_(request.idToken);
    else if (action === 'admission.enquiries.list') data = bjpsApiAdmissionListEnquiries_(request.idToken, request.filters || {});
    else if (action === 'admission.enquiries.create') data = bjpsApiAdmissionCreateEnquiry_(request.idToken, request.record || {});
    else throw bjpsApiError_('ACTION_NOT_ALLOWED','This API action is not available.');
    return bjpsApiJson_({success:true, data:data});
  } catch (error) {
    const code = error && error.apiCode ? error.apiCode : 'REQUEST_FAILED';
    const message = error && error.apiCode ? error.message : 'The request could not be completed. Check the API deployment and server logs.';
    console.error('BJPS API v1 failure [' + code + ']: ' + String(error && error.stack || error));
    return bjpsApiJson_({success:false, error:{code:code, message:message}});
  }
}

function bjpsApiRequireSchoolIdentity_(idToken) {
  const identity=verifyBJPSFirebaseIdToken(idToken);
  const email=String(identity.email || '').trim().toLowerCase();
  if(identity.emailVerified!==true) throw bjpsApiError_('EMAIL_NOT_VERIFIED','Verify your school Google account email before continuing.');
  if(!email.endsWith('@'+BJPS_API_V1.ALLOWED_DOMAIN)) throw bjpsApiError_('SCHOOL_ACCOUNT_REQUIRED','Use your official @baljyoti.com account.');
  const values=getBJPSERPSheet(BJPS_RBAC.DATABASE_KEY,BJPS_RBAC.TABLES.USERS).getDataRange().getValues();
  const headers=values.length?values[0].map(function(v){return String(v || '').trim();}):[];
  const ix=bjpsApiHeaderIndexes_(headers,['FirebaseUID','Email','AccountStatus']);
  const row=values.slice(1).find(function(item){return String(item[ix.FirebaseUID] || '').trim()===String(identity.uid || '').trim();});
  if(!row || String(row[ix.Email] || '').trim().toLowerCase()!==email || String(row[ix.AccountStatus] || '').trim().toUpperCase()!=='ACTIVE') {
    throw bjpsApiError_('ERP_ACCOUNT_INACTIVE','An active, matching ERP account is required.');
  }
  return identity;
}

/** First functional slice: secured Admission enquiry list and create. */
function bjpsApiAdmissionListEnquiries_(idToken, filters) {
  bjpsApiRequireSchoolIdentity_(idToken);
  authorizeBJPSERPRequest_(idToken, 'ADMISSION_VIEW', {type:'GLOBAL', id:''});
  const sheet = getBJPSERPSheet('ADMISSION_DATABASE', 'ADMISSION_ENQUIRIES');
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw bjpsApiError_('SCHEMA_INVALID','Admission enquiry sheet has no header row.');
  const headers = values[0].map(function(v){return String(v || '').trim();});
  const ix = bjpsApiHeaderIndexes_(headers, ['EnquiryID','EnquiryNumber','AcademicYearID','EnquiryDate','StudentName','ClassAppliedID','CurrentStage','EnquiryStatus','NextFollowUpDate','AssignedCounsellorID']);
  const yearId = bjpsApiGetCurrentAcademicYearId_();
  const search = String(filters.search || '').trim().toLowerCase();
  const status = String(filters.status || '').trim().toUpperCase();
  const stage = String(filters.stage || '').trim().toUpperCase();
  const rows = values.slice(1).filter(function(row) {
    if (String(row[ix.AcademicYearID] || '').trim() !== yearId) return false;
    if (status && String(row[ix.EnquiryStatus] || '').trim().toUpperCase() !== status) return false;
    if (stage && String(row[ix.CurrentStage] || '').trim().toUpperCase() !== stage) return false;
    if (search && [row[ix.EnquiryNumber],row[ix.StudentName],row[ix.ClassAppliedID]].join(' ').toLowerCase().indexOf(search) < 0) return false;
    return true;
  }).slice(-200).reverse();
  return {academicYearId:yearId,count:rows.length,records:rows.map(function(row) {
    return {
      enquiryId:String(row[ix.EnquiryID] || ''), enquiryNumber:String(row[ix.EnquiryNumber] || ''),
      enquiryDate:bjpsApiDateValue_(row[ix.EnquiryDate]), studentName:String(row[ix.StudentName] || ''),
      classAppliedId:String(row[ix.ClassAppliedID] || ''), currentStage:String(row[ix.CurrentStage] || ''),
      enquiryStatus:String(row[ix.EnquiryStatus] || ''), nextFollowUpDate:bjpsApiDateValue_(row[ix.NextFollowUpDate]),
      assignedCounsellorId:String(row[ix.AssignedCounsellorID] || '')
    };
  })};
}

function bjpsApiAdmissionCreateEnquiry_(idToken, record) {
  const identity = bjpsApiRequireSchoolIdentity_(idToken);
  authorizeBJPSERPRequest_(idToken, 'ADMISSION_CREATE', {type:'GLOBAL', id:''});
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw bjpsApiError_('BUSY','Another admission update is in progress. Please retry.');
  try {
    const sheet = getBJPSERPSheet('ADMISSION_DATABASE', 'ADMISSION_ENQUIRIES');
    const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0].map(function(v){return String(v || '').trim();});
    const ix = bjpsApiHeaderIndexes_(headers, ['EnquiryID','EnquiryNumber','AcademicYearID','EnquiryDate','StudentName','ClassAppliedID','CurrentStage','EnquiryStatus','CreatedAt','CreatedBy']);
    const studentName = String(record.studentName || '').trim();
    const classAppliedId = String(record.classAppliedId || '').trim();
    if (!studentName || !classAppliedId) throw bjpsApiError_('VALIDATION_FAILED','Student name and applied class are required.');
    if (studentName.length > 150 || classAppliedId.length > 80) throw bjpsApiError_('VALIDATION_FAILED','One or more fields exceed the allowed length.');
    const yearId = bjpsApiGetCurrentAcademicYearId_();
    const now = new Date();
    const row = new Array(headers.length).fill('');
    const put = function(name,value){row[ix[name]]=value;};
    put('EnquiryID','ENQ_' + Utilities.getUuid());
    put('EnquiryNumber','ENQ-' + yearId.replace(/[^A-Za-z0-9]/g,'').slice(-12) + '-' + Utilities.getUuid().slice(0,8).toUpperCase());
    put('AcademicYearID',yearId); put('EnquiryDate',now); put('StudentName',studentName);
    put('ClassAppliedID',classAppliedId); put('CurrentStage','ENQUIRY'); put('EnquiryStatus','NEW');
    put('CreatedAt',now); put('CreatedBy',String(identity.uid || ''));
    const optional = {dob:'DOB',gender:'Gender',fatherName:'FatherName',motherName:'MotherName',mobileNumber:'MobileNumber',email:'Email',address:'Address',enquirySource:'EnquirySource',remarks:'Remarks'};
    Object.keys(optional).forEach(function(key) {
      const name=optional[key];
      if (ix[name] !== undefined && record[key] !== undefined) {
        const value=String(record[key] || '').trim();
        if (value.length>500) throw bjpsApiError_('VALIDATION_FAILED',name + ' exceeds the allowed length.');
        row[ix[name]]=value;
      }
    });
    sheet.appendRow(row);
    return {enquiryId:row[ix.EnquiryID],enquiryNumber:row[ix.EnquiryNumber],academicYearId:yearId,enquiryStatus:'NEW'};
  } finally { lock.releaseLock(); }
}

function bjpsApiGetCurrentAcademicYearId_() {
  const sheet=getBJPSERPSheet('CORE_MASTER','ACADEMIC_YEARS');
  const values=sheet.getDataRange().getValues();
  if(values.length<2) throw bjpsApiError_('ACADEMIC_YEAR_NOT_CONFIGURED','The current academic year is not configured in Core Master.');
  const ix=bjpsApiHeaderIndexes_(values[0].map(function(v){return String(v || '').trim();}),['AcademicYearID','IsCurrent','Status']);
  const current=values.slice(1).filter(function(row){return row[ix.IsCurrent]===true && String(row[ix.Status] || '').trim().toUpperCase()==='ACTIVE';});
  if(current.length!==1) throw bjpsApiError_('ACADEMIC_YEAR_NOT_CONFIGURED','Exactly one active current academic year must be configured.');
  return String(current[0][ix.AcademicYearID] || '').trim();
}

function bjpsApiHeaderIndexes_(headers,required) {
  const ix={}; headers.forEach(function(name,index){if(name)ix[name]=index;});
  const missing=required.filter(function(name){return ix[name]===undefined;});
  if(missing.length) throw bjpsApiError_('SCHEMA_INVALID','Required columns are missing: '+missing.join(', ')+'.');
  return ix;
}
function bjpsApiDateValue_(value) {
  if(!value)return '';
  return value instanceof Date ? Utilities.formatDate(value,Session.getScriptTimeZone(),'yyyy-MM-dd') : String(value);
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
