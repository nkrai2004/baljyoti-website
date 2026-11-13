/**
 * BJPS-ERP development fixtures (Google Sheets native).
 *
 * SAFETY:
 * - Never clears/replaces a worksheet or its headers.
 * - Writes only to the explicitly allowlisted tables below.
 * - Requires the live headers to contain each table's required fields.
 * - Every fixture uses a DEV-2026- marker and is recorded in ERP_DEV_DATA_REGISTRY.
 * - Cleanup deletes only registered rows whose marker key still matches.
 *
 * Install alongside Code.gs and BJPS_ERP_API_v1.gs.
 */
// Self-contained database map: this file can run even if the shared foundation
// file has not yet been copied into the same Apps Script project.
const BJPS_DEV_DATABASES_ = Object.freeze({
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
const BJPS_DEV_MARKER_ = 'DEV-2026-';
const BJPS_DEV_REGISTRY_SHEET_ = 'ERP_DEV_DATA_REGISTRY';
const BJPS_DEV_REGISTRY_HEADERS_ = [
  'BatchID','DatabaseKey','SheetName','RowNumber','KeyColumn','MarkerValue','InsertedAt','InsertedBy'
];

// Intentionally limited to schemas already used by the Academic pilot API.
// Additional module tables are added only after their live headers are audited.
const BJPS_DEV_FIXTURE_PLAN_ = [
  {
    databaseKey:'CORE_MASTER', sheetName:'ACADEMIC_YEARS',
    required:['AcademicYearID','IsCurrent','Status'], keyColumn:'AcademicYearID',
    rows:[{
      AcademicYearID:'DEV-2026-27', AcademicYearName:'DEV SAMPLE 2026–27',
      StartDate:new Date(2026,3,1), EndDate:new Date(2027,2,31),
      IsCurrent:false, Status:'ACTIVE'
    }]
  },
  {
    databaseKey:'CORE_MASTER', sheetName:'CLASSES',
    required:['ClassID','ClassName','ClassOrder','Status'], keyColumn:'ClassID',
    rows:[
      {ClassID:'DEV-CLS-NUR',ClassName:'DEV Nursery',ClassOrder:0,Status:'ACTIVE'},
      {ClassID:'DEV-CLS-01',ClassName:'DEV Class 1',ClassOrder:1,Status:'ACTIVE'},
      {ClassID:'DEV-CLS-03',ClassName:'DEV Class 3',ClassOrder:3,Status:'ACTIVE'}
    ]
  },
  {
    databaseKey:'CORE_MASTER', sheetName:'SECTIONS',
    required:['SectionID','SectionName','ClassID','AcademicYearID','Status'], keyColumn:'SectionID',
    rows:[
      {SectionID:'DEV-SEC-NUR-A',SectionName:'DEV A',ClassID:'DEV-CLS-NUR',AcademicYearID:'DEV-2026-27',Status:'ACTIVE'},
      {SectionID:'DEV-SEC-01-A',SectionName:'DEV A',ClassID:'DEV-CLS-01',AcademicYearID:'DEV-2026-27',Status:'ACTIVE'},
      {SectionID:'DEV-SEC-03-B',SectionName:'DEV B',ClassID:'DEV-CLS-03',AcademicYearID:'DEV-2026-27',Status:'ACTIVE'}
    ]
  },
  {
    databaseKey:'ACADEMIC_DATABASE', sheetName:'CLASS_SECTION_ASSIGNMENTS',
    required:['StudentID','AcademicYearID','ClassID','SectionID','Status'], keyColumn:'StudentID',
    rows:[
      {StudentID:'DEV-STU-001',AcademicYearID:'DEV-2026-27',ClassID:'DEV-CLS-NUR',SectionID:'DEV-SEC-NUR-A',Status:'ACTIVE'},
      {StudentID:'DEV-STU-002',AcademicYearID:'DEV-2026-27',ClassID:'DEV-CLS-01',SectionID:'DEV-SEC-01-A',Status:'ACTIVE'},
      {StudentID:'DEV-STU-003',AcademicYearID:'DEV-2026-27',ClassID:'DEV-CLS-03',SectionID:'DEV-SEC-03-B',Status:'ACTIVE'}
    ]
  }
];

function bjpsDevGetSpreadsheet_(databaseKey) {
  const propertyName = BJPS_DEV_DATABASES_[String(databaseKey || '').trim()];
  if (!propertyName) throw new Error('Unknown database key: ' + databaseKey);
  const id = PropertiesService.getScriptProperties().getProperty(propertyName);
  if (!id) throw new Error('Missing Script Property: ' + propertyName);
  return SpreadsheetApp.openById(String(id).trim());
}
function bjpsDevHeaderMap_(sheet) {
  if (sheet.getLastRow() < 1 || sheet.getLastColumn() < 1) return {};
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0];
  const map = {};
  headers.forEach(function(v,i){ const k=String(v || '').trim(); if(k) map[k]=i+1; });
  return map;
}
function bjpsDevGetRegistry_(createIfMissing) {
  const ss = bjpsDevGetSpreadsheet_('WORKFLOW_AUDIT');
  let sh = ss.getSheetByName(BJPS_DEV_REGISTRY_SHEET_);
  if (!sh && createIfMissing) {
    sh = ss.insertSheet(BJPS_DEV_REGISTRY_SHEET_);
    sh.getRange(1,1,1,BJPS_DEV_REGISTRY_HEADERS_.length).setValues([BJPS_DEV_REGISTRY_HEADERS_]);
    sh.setFrozenRows(1);
  }
  if (sh) {
    const actual = sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getDisplayValues()[0];
    if (BJPS_DEV_REGISTRY_HEADERS_.some(function(h,i){return actual[i]!==h;})) {
      throw new Error('Development registry exists but its headers do not match. No changes made.');
    }
  }
  return sh;
}

/** Lists configured database Script Property NAMES only; never exposes IDs or values. */
function listBJPSERPDevPropertyStatus() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const report = Object.keys(BJPS_DEV_DATABASES_).map(function(key) {
    const propertyName = BJPS_DEV_DATABASES_[key];
    return {databaseKey:key, propertyName:propertyName, configured:Object.prototype.hasOwnProperty.call(props,propertyName) && Boolean(String(props[propertyName] || '').trim())};
  });
  const result = {configuredCount:report.filter(function(x){return x.configured;}).length, expectedCount:report.length, properties:report};
  Logger.log(JSON.stringify(result,null,2));
  return result;
}

/** Read-only inventory: lists worksheet names, row counts and headers across all 14 databases. */
function auditBJPSERPDevelopmentSchemas() {
  const report = {databaseCount:0,worksheets:[],errors:[]};
  Object.keys(BJPS_DEV_DATABASES_).forEach(function(key) {
    try {
      const ss=bjpsDevGetSpreadsheet_(key);
      report.databaseCount++;
      ss.getSheets().forEach(function(sh) {
        report.worksheets.push({
          databaseKey:key, sheetName:sh.getName(), lastRow:sh.getLastRow(),
          lastColumn:sh.getLastColumn(),
          headers:sh.getLastColumn() ? sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0] : []
        });
      });
    } catch(e) { report.errors.push({databaseKey:key,error:String(e.message || e)}); }
  });
  Logger.log(JSON.stringify(report,null,2));
  return report;
}

/** Preview only: no sheets or rows are created or changed. */
function previewBJPSERPDevSeed() {
  const report={safeToSeed:true,plannedRows:0,tables:[],warnings:[]};
  BJPS_DEV_FIXTURE_PLAN_.forEach(function(plan) {
    try {
      const sh=bjpsDevGetSpreadsheet_(plan.databaseKey).getSheetByName(plan.sheetName);
      if (!sh) throw new Error('Worksheet not found');
      const map=bjpsDevHeaderMap_(sh);
      const missing=plan.required.filter(function(h){return !map[h];});
      if (missing.length) throw new Error('Missing required headers: '+missing.join(', '));
      const keyCol=map[plan.keyColumn];
      const existing=sh.getLastRow()>1 ? sh.getRange(2,keyCol,sh.getLastRow()-1,1).getDisplayValues().flat() : [];
      const duplicates=plan.rows.filter(function(r){return existing.indexOf(String(r[plan.keyColumn]))>=0;});
      const result={databaseKey:plan.databaseKey,sheetName:plan.sheetName,rows:plan.rows.length,alreadyPresent:duplicates.length,missingHeaders:[]};
      if (duplicates.length) { result.status='SKIP_DUPLICATE_MARKER'; result.duplicateKeys=duplicates.map(function(r){return r[plan.keyColumn];}); }
      else { result.status='READY'; report.plannedRows+=plan.rows.length; }
      report.tables.push(result);
    } catch(e) {
      report.safeToSeed=false;
      report.tables.push({databaseKey:plan.databaseKey,sheetName:plan.sheetName,status:'BLOCKED',error:String(e.message || e)});
    }
  });
  try { const reg=bjpsDevGetRegistry_(false); report.registryExists=Boolean(reg); }
  catch(e) { report.safeToSeed=false; report.warnings.push(String(e.message || e)); }
  Logger.log(JSON.stringify(report,null,2));
  return report;
}

/** Inserts only the approved DEV fixture plan. Run previewBJPSERPDevSeed first. */
function seedBJPSERPDevData() {
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) throw new Error('Another ERP setup task is running.');
  try {
    const preview=previewBJPSERPDevSeed();
    if(!preview.safeToSeed) throw new Error('Seed blocked: one or more live schemas do not match. See preview log.');
    const registry=bjpsDevGetRegistry_(true);
    const batch='DEV-2026-'+Utilities.getUuid();
    const actor=Session.getActiveUser().getEmail() || 'authorized-admin';
    const inserted=[];
    BJPS_DEV_FIXTURE_PLAN_.forEach(function(plan) {
      const sh=bjpsDevGetSpreadsheet_(plan.databaseKey).getSheetByName(plan.sheetName);
      const map=bjpsDevHeaderMap_(sh);
      const keyCol=map[plan.keyColumn];
      const existing=sh.getLastRow()>1 ? sh.getRange(2,keyCol,sh.getLastRow()-1,1).getDisplayValues().flat() : [];
      if(plan.rows.some(function(r){return existing.indexOf(String(r[plan.keyColumn]))>=0;})) return;
      const headers=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];
      const values=plan.rows.map(function(obj){return headers.map(function(h){return Object.prototype.hasOwnProperty.call(obj,h)?obj[h]:'';});});
      const start=sh.getLastRow()+1;
      sh.getRange(start,1,values.length,headers.length).setValues(values);
      const tableRegistry=plan.rows.map(function(obj,i){
        return [batch,plan.databaseKey,plan.sheetName,start+i,plan.keyColumn,String(obj[plan.keyColumn]),new Date(),actor];
      });
      // Register immediately after each table append so a later failure remains cleanable.
      if(tableRegistry.length) registry.getRange(registry.getLastRow()+1,1,tableRegistry.length,BJPS_DEV_REGISTRY_HEADERS_.length).setValues(tableRegistry);
      Array.prototype.push.apply(inserted,tableRegistry);
    });
    const result={batchID:batch,insertedRows:inserted.length,registrySheet:BJPS_DEV_REGISTRY_SHEET_,tables:inserted.length};
    Logger.log(JSON.stringify(result,null,2));
    return result;
  } finally { lock.releaseLock(); }
}

/** Preview exactly which registered fixture rows still match their DEV marker. */
function previewBJPSERPDevCleanup() {
  const registry=bjpsDevGetRegistry_(false);
  if(!registry || registry.getLastRow()<2) return {registeredRows:0,matchedRows:0,blockedRows:0,items:[]};
  const rows=registry.getRange(2,1,registry.getLastRow()-1,BJPS_DEV_REGISTRY_HEADERS_.length).getValues();
  const items=[]; let matched=0,blocked=0;
  rows.forEach(function(r,i) {
    if(!r[0]) return;
    try {
      const sh=bjpsDevGetSpreadsheet_(String(r[1])).getSheetByName(String(r[2]));
      const rowNumber=Number(r[3]), map=bjpsDevHeaderMap_(sh), col=map[String(r[4])];
      const current=sh && rowNumber>1 && col ? sh.getRange(rowNumber,col).getDisplayValue() : '';
      const ok=String(current)===String(r[5]) && String(r[5]).indexOf(BJPS_DEV_MARKER_)===0;
      if(ok) matched++; else blocked++;
      items.push({registryRow:i+2,databaseKey:r[1],sheetName:r[2],rowNumber:rowNumber,marker:r[5],status:ok?'MATCH':'DO_NOT_DELETE'});
    } catch(e) { blocked++; items.push({registryRow:i+2,status:'ERROR',error:String(e.message || e)}); }
  });
  const result={registeredRows:items.length,matchedRows:matched,blockedRows:blocked,items:items};
  Logger.log(JSON.stringify(result,null,2));
  return result;
}

/** Deletes only exact registry-matched DEV rows, bottom-up per worksheet; then clears registry entries. */
function cleanupBJPSERPDevData() {
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(10000)) throw new Error('Another ERP setup task is running.');
  try {
    const preview=previewBJPSERPDevCleanup();
    if(preview.blockedRows) throw new Error('Cleanup blocked: at least one registered row no longer matches its DEV marker. Review preview; nothing deleted.');
    if(!preview.matchedRows) return {deletedRows:0};
    const registry=bjpsDevGetRegistry_(false);
    const rows=registry.getRange(2,1,registry.getLastRow()-1,BJPS_DEV_REGISTRY_HEADERS_.length).getValues();
    const grouped={};
    rows.forEach(function(r,i){if(!r[0])return;const k=String(r[1])+'|'+String(r[2]);(grouped[k]||(grouped[k]={databaseKey:String(r[1]),sheetName:String(r[2]),items:[]})).items.push({row:Number(r[3]),registryRow:i+2});});
    Object.keys(grouped).forEach(function(k){
      const g=grouped[k], sh=bjpsDevGetSpreadsheet_(g.databaseKey).getSheetByName(g.sheetName);
      g.items.sort(function(a,b){return b.row-a.row;}).forEach(function(x){sh.deleteRow(x.row);});
    });
    registry.getRange(2,1,registry.getLastRow()-1,BJPS_DEV_REGISTRY_HEADERS_.length).clearContent();
    return {deletedRows:preview.matchedRows,registryCleared:true};
  } finally { lock.releaseLock(); }
}
