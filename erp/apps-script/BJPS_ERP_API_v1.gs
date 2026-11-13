/**
 * BJPS-ERP API v1 — restricted session bootstrap.
 * Add this as a NEW .gs file to the existing Apps Script project.
 * This API deliberately exposes no arbitrary spreadsheet read/write action.
 */
const BJPS_API_V1 = Object.freeze({
  VERSION: '1.0.0',
  MAX_BODY_CHARS: 16000,
  ALLOWED_DOMAIN: 'baljyoti.com',
  ACTIONS: Object.freeze(['session.bootstrap','admission.enquiries.list','admission.enquiries.create','admission.followups.list','admission.followups.create','academic.classSections.list'])
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
    else if (action === 'admission.followups.list') data = bjpsApiAdmissionListFollowups_(request.idToken, request.enquiryId);
    else if (action === 'admission.followups.create') data = bjpsApiAdmissionCreateFollowup_(request.idToken, request.record || {});
    else if (action === 'academic.classSections.list') data = bjpsApiAcademicListClassSections_(request.idToken);
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
  if (!idToken || typeof idToken !== 'string' || idToken.length > 12000) throw bjpsApiError_('AUTH_REQUIRED','A valid Firebase ID token is required.');
  const identity=verifyBJPSFirebaseIdToken(idToken);
  if (!identity || identity.authenticated !== true || identity.disabled === true || !identity.uid) throw bjpsApiError_('AUTH_FAILED','Authentication could not be verified.');
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
  if (!filters || typeof filters !== 'object' || Array.isArray(filters)) throw bjpsApiError_('VALIDATION_FAILED','Filters must be an object.');
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
    bjpsApiRequireActiveClass_(classAppliedId);
    const now = new Date();
    const row = new Array(headers.length).fill('');
    const put = function(name,value){row[ix[name]]=value;};
    put('EnquiryID','ENQ_' + Utilities.getUuid());
    put('EnquiryNumber','ENQ-' + yearId.replace(/[^A-Za-z0-9]/g,'').slice(-12) + '-' + Utilities.getUuid().slice(0,8).toUpperCase());
    put('AcademicYearID',yearId); put('EnquiryDate',now); put('StudentName',bjpsApiSafeCellText_(studentName));
    put('ClassAppliedID',bjpsApiSafeCellText_(classAppliedId)); put('CurrentStage','ENQUIRY'); put('EnquiryStatus','NEW');
    put('CreatedAt',now); put('CreatedBy',String(identity.uid || ''));
    const optional = {dob:'DOB',gender:'Gender',fatherName:'FatherName',motherName:'MotherName',mobileNumber:'MobileNumber',email:'Email',address:'Address',enquirySource:'EnquirySource',remarks:'Remarks'};
    Object.keys(optional).forEach(function(key) {
      const name=optional[key];
      if (ix[name] !== undefined && record[key] !== undefined) {
        const value=String(record[key] || '').trim();
        if (value.length>500) throw bjpsApiError_('VALIDATION_FAILED',name + ' exceeds the allowed length.');
        row[ix[name]]=bjpsApiSafeCellText_(value);
      }
    });
    sheet.appendRow(row);
    return {enquiryId:row[ix.EnquiryID],enquiryNumber:row[ix.EnquiryNumber],academicYearId:yearId,enquiryStatus:'NEW'};
  } finally { lock.releaseLock(); }
}


/** Reject unknown/inactive class references before writing an enquiry. */
function bjpsApiRequireActiveClass_(classId) {
  const sheet = getBJPSERPSheet('CORE_MASTER', 'CLASSES');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) throw bjpsApiError_('CLASS_NOT_AVAILABLE','No active classes are configured.');
  const ix = bjpsApiHeaderIndexes_(values[0].map(function(v){return String(v || '').trim();}), ['ClassID','Status']);
  const found = values.slice(1).some(function(row) {
    return String(row[ix.ClassID] || '').trim() === classId &&
      String(row[ix.Status] || '').trim().toUpperCase() === 'ACTIVE';
  });
  if (!found) throw bjpsApiError_('CLASS_NOT_AVAILABLE','Select an active class from the school class list.');
}

/** Prevent user-entered text from being interpreted as a spreadsheet formula. */
function bjpsApiSafeCellText_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
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

/**
 * Academic pilot: expose only class/section reference data and aggregate placement
 * counts. No student names, IDs, guardian data or individual attendance are returned.
 */
function bjpsApiAcademicListClassSections_(idToken) {
  bjpsApiRequireSchoolIdentity_(idToken);
  authorizeBJPSERPRequest_(idToken, 'STUDENT_PROFILE_VIEW', {type:'GLOBAL', id:''});
  const yearId = bjpsApiGetCurrentAcademicYearId_();
  const coreClasses = getBJPSERPSheet('CORE_MASTER','CLASSES').getDataRange().getValues();
  const coreSections = getBJPSERPSheet('CORE_MASTER','SECTIONS').getDataRange().getValues();
  const placementRows = getBJPSERPSheet('ACADEMIC_DATABASE','CLASS_SECTION_ASSIGNMENTS').getDataRange().getValues();
  if (coreClasses.length < 1 || coreSections.length < 1 || placementRows.length < 1) {
    throw bjpsApiError_('SCHEMA_INVALID','Academic class, section or placement tables are unavailable.');
  }
  const ci = bjpsApiHeaderIndexes_(coreClasses[0].map(v=>String(v || '').trim()),['ClassID','ClassName','ClassOrder','Status']);
  const si = bjpsApiHeaderIndexes_(coreSections[0].map(v=>String(v || '').trim()),['SectionID','SectionName','ClassID','AcademicYearID','Status']);
  const pi = bjpsApiHeaderIndexes_(placementRows[0].map(v=>String(v || '').trim()),['StudentID','AcademicYearID','ClassID','SectionID','Status']);
  const counts = {};
  placementRows.slice(1).forEach(row => {
    if (String(row[pi.AcademicYearID] || '').trim() !== yearId ||
        String(row[pi.Status] || '').trim().toUpperCase() !== 'ACTIVE') return;
    const key = String(row[pi.ClassID] || '').trim() + '|' + String(row[pi.SectionID] || '').trim();
    counts[key] = (counts[key] || 0) + 1;
  });
  const sections = coreSections.slice(1).filter(row =>
    String(row[si.AcademicYearID] || '').trim() === yearId &&
    String(row[si.Status] || '').trim().toUpperCase() === 'ACTIVE'
  );
  const records = coreClasses.slice(1)
    .filter(row => String(row[ci.Status] || '').trim().toUpperCase() === 'ACTIVE')
    .sort((a,b) => Number(a[ci.ClassOrder] || 0) - Number(b[ci.ClassOrder] || 0))
    .map(row => {
      const classId = String(row[ci.ClassID] || '').trim();
      const classSections = sections.filter(section => String(section[si.ClassID] || '').trim() === classId)
        .map(section => {
          const sectionId = String(section[si.SectionID] || '').trim();
          return {sectionId:sectionId,sectionName:String(section[si.SectionName] || ''),activePlacements:counts[classId+'|'+sectionId] || 0};
        });
      return {classId:classId,className:String(row[ci.ClassName] || ''),classOrder:Number(row[ci.ClassOrder] || 0),sectionCount:classSections.length,activePlacements:classSections.reduce((n,s)=>n+s.activePlacements,0),sections:classSections};
    });
  return {academicYearId:yearId,classCount:records.length,sectionCount:records.reduce((n,c)=>n+c.sectionCount,0),activePlacements:records.reduce((n,c)=>n+c.activePlacements,0),classes:records};
}

function bjpsApiJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
function bjpsApiError_(code,message) {
  const error = new Error(message);
  error.apiCode = code;
  return error;
}


/**
 * Admission follow-up history. Enquiry ownership is constrained to the active
 * academic year before any follow-up data is returned or changed.
 */
function bjpsApiAdmissionFindCurrentEnquiry_(enquiryId) {
  const id = String(enquiryId || '').trim();
  if (!id || id.length > 100) throw bjpsApiError_('VALIDATION_FAILED','A valid enquiry ID is required.');
  const sheet = getBJPSERPSheet('ADMISSION_DATABASE','ADMISSION_ENQUIRIES');
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw bjpsApiError_('SCHEMA_INVALID','Admission enquiry sheet has no header row.');
  const ix = bjpsApiHeaderIndexes_(values[0].map(v=>String(v || '').trim()),['EnquiryID','AcademicYearID']);
  const yearId = bjpsApiGetCurrentAcademicYearId_();
  const rowIndex = values.slice(1).findIndex(row =>
    String(row[ix.EnquiryID] || '').trim() === id &&
    String(row[ix.AcademicYearID] || '').trim() === yearId
  );
  if (rowIndex < 0) throw bjpsApiError_('ENQUIRY_NOT_FOUND','The enquiry was not found in the active academic session.');
  return {sheet:sheet,rowNumber:rowIndex+2,yearId:yearId};
}

function bjpsApiAdmissionListFollowups_(idToken,enquiryId) {
  bjpsApiRequireSchoolIdentity_(idToken);
  authorizeBJPSERPRequest_(idToken,'ADMISSION_VIEW',{type:'GLOBAL',id:''});
  const enquiry = bjpsApiAdmissionFindCurrentEnquiry_(enquiryId);
  const sheet = getBJPSERPSheet('ADMISSION_DATABASE','ADMISSION_FOLLOWUPS');
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw bjpsApiError_('SCHEMA_INVALID','Admission follow-up sheet has no header row.');
  const ix = bjpsApiHeaderIndexes_(values[0].map(v=>String(v || '').trim()),['FollowUpID','EnquiryID','FollowUpDateTime','ContactMode','ContactedBy','Outcome','ParentResponse','NextAction','NextFollowUpDate','Remarks','CreatedAt']);
  const records = values.slice(1).filter(row=>String(row[ix.EnquiryID] || '').trim()===String(enquiry.sheet.getRange(enquiry.rowNumber,1).getValue() || '').trim())
    .map(row=>({
      followUpId:String(row[ix.FollowUpID] || ''),
      followUpDateTime:bjpsApiDateValue_(row[ix.FollowUpDateTime]),
      contactMode:String(row[ix.ContactMode] || ''),
      outcome:String(row[ix.Outcome] || ''),
      parentResponse:String(row[ix.ParentResponse] || ''),
      nextAction:String(row[ix.NextAction] || ''),
      nextFollowUpDate:bjpsApiDateValue_(row[ix.NextFollowUpDate]),
      remarks:String(row[ix.Remarks] || '')
    })).reverse().slice(0,100);
  return {enquiryId:String(enquiry.sheet.getRange(enquiry.rowNumber,1).getValue() || ''),count:records.length,records:records};
}

function bjpsApiAdmissionCreateFollowup_(idToken,record) {
  const identity = bjpsApiRequireSchoolIdentity_(idToken);
  authorizeBJPSERPRequest_(idToken,'ADMISSION_CREATE',{type:'GLOBAL',id:''});
  const enquiryId=String(record.enquiryId || '').trim();
  const enquiry=bjpsApiAdmissionFindCurrentEnquiry_(enquiryId);
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) throw bjpsApiError_('BUSY','Another admission update is in progress. Please retry.');
  try {
    const sheet=getBJPSERPSheet('ADMISSION_DATABASE','ADMISSION_FOLLOWUPS');
    const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0].map(v=>String(v || '').trim());
    const ix=bjpsApiHeaderIndexes_(headers,['FollowUpID','EnquiryID','FollowUpDateTime','ContactMode','ContactedBy','Outcome','ParentResponse','NextAction','NextFollowUpDate','Remarks','CreatedAt']);
    const mode=String(record.contactMode || '').trim();
    const outcome=String(record.outcome || '').trim();
    const nextAction=String(record.nextAction || '').trim();
    const parentResponse=String(record.parentResponse || '').trim();
    const remarks=String(record.remarks || '').trim();
    const nextDate=String(record.nextFollowUpDate || '').trim();
    if(!mode || !outcome) throw bjpsApiError_('VALIDATION_FAILED','Contact mode and outcome are required.');
    if(mode.length>50 || outcome.length>200 || nextAction.length>300 || parentResponse.length>500 || remarks.length>1000) throw bjpsApiError_('VALIDATION_FAILED','One or more follow-up fields exceed the allowed length.');
    let followDate=new Date();
    if(record.followUpDateTime) {
      followDate=new Date(record.followUpDateTime);
      if(isNaN(followDate.getTime())) throw bjpsApiError_('VALIDATION_FAILED','Follow-up date and time is invalid.');
      if(followDate.getTime()>Date.now()+5*60*1000) throw bjpsApiError_('VALIDATION_FAILED','A follow-up cannot be dated in the future.');
    }
    let nextFollowDate='';
    if(nextDate) {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(nextDate) || isNaN(new Date(nextDate+'T00:00:00').getTime())) throw bjpsApiError_('VALIDATION_FAILED','Next follow-up date must be a valid YYYY-MM-DD date.');
      nextFollowDate=new Date(nextDate+'T00:00:00');
    }
    const row=new Array(headers.length).fill('');
    const put=(name,value)=>{row[ix[name]]=value;};
    put('FollowUpID','FUP_'+Utilities.getUuid());
    put('EnquiryID',enquiryId);
    put('FollowUpDateTime',followDate);
    put('ContactMode',bjpsApiSafeCellText_(mode));
    put('ContactedBy',String(identity.uid || ''));
    put('Outcome',bjpsApiSafeCellText_(outcome));
    put('ParentResponse',bjpsApiSafeCellText_(parentResponse));
    put('NextAction',bjpsApiSafeCellText_(nextAction));
    put('NextFollowUpDate',nextFollowDate);
    put('Remarks',bjpsApiSafeCellText_(remarks));
    put('CreatedAt',new Date());
    sheet.appendRow(row);
    const enquiryHeaders=enquiry.sheet.getRange(1,1,1,enquiry.sheet.getLastColumn()).getDisplayValues()[0].map(v=>String(v || '').trim());
    const enquiryIx=bjpsApiHeaderIndexes_(enquiryHeaders,['UpdatedAt','NextFollowUpDate']);
    enquiry.sheet.getRange(enquiry.rowNumber,enquiryIx.NextFollowUpDate+1).setValue(nextFollowDate);
    enquiry.sheet.getRange(enquiry.rowNumber,enquiryIx.UpdatedAt+1).setValue(new Date());
    return {followUpId:row[ix.FollowUpID],enquiryId:enquiryId,nextFollowUpDate:nextDate};
  } finally {lock.releaseLock();}
}
