/**
 * Bal Jyoti School OS — Google Sheets data gateway.
 * Deploy as an Apps Script Web App owned by the school's Workspace account.
 * Only trusted Firebase Functions should call this endpoint.
 * Never share the spreadsheet directly with staff/parents/students.
 */
const CONFIG = {
  VERSION: "1.0.0",
  TABS: {
    Students: ["recordId","admissionNo","firstName","lastName","className","section","guardianName","status","isSample","createdAt","updatedAt"],
    Parents: ["recordId","parentId","fullName","phone","email","address","status","createdAt","updatedAt"],
    ParentStudentLinks: ["recordId","parentId","studentId","relationship","verified","createdAt","updatedAt"],
    Admissions: ["recordId","enquiryNo","studentName","classApplied","guardianName","phone","source","status","followUpDate","notes","createdAt","updatedAt"],
    Classes: ["recordId","academicYear","className","section","capacity","classTeacherId","status"],
    Subjects: ["recordId","academicYear","className","section","subjectName","subjectCode","status"],
    Staff: ["recordId","staffId","fullName","designation","department","email","phone","status","createdAt","updatedAt"],
    TeacherAssignments: ["recordId","teacherId","className","section","subject","academicYear","status"],
    StudentAttendance: ["recordId","date","studentId","className","section","status","markedBy","remarks","createdAt","updatedAt"],
    StaffAttendance: ["recordId","date","staffId","status","markedBy","remarks","createdAt","updatedAt"],
    Timetable: ["recordId","academicYear","day","period","startTime","endTime","className","section","subject","teacherId","room","status"],
    Homework: ["recordId","title","className","section","subject","description","assignedBy","assignedAt","dueDate","status"],
    Assessments: ["recordId","title","className","section","subject","examDate","maxMarks","status"],
    Marks: ["recordId","assessmentId","studentId","marksObtained","remarks","enteredBy","updatedAt"],
    FeeStructures: ["recordId","academicYear","className","feeHead","amount","frequency","status"],
    FeeInvoices: ["recordId","invoiceNo","studentId","academicYear","feeHead","amount","dueDate","status","createdAt"],
    FeePayments: ["recordId","receiptNo","invoiceId","studentId","amount","paymentDate","mode","reference","receivedBy"],
    Expenses: ["recordId","voucherNo","date","category","description","amount","paidTo","approvedBy","status"],
    LeaveRequests: ["recordId","staffId","leaveType","fromDate","toDate","reason","status","reviewedBy","createdAt"],
    TransportRoutes: ["recordId","routeName","vehicleId","driverId","helperId","status"],
    LibraryBooks: ["recordId","accessionNo","title","author","category","status"],
    LibraryIssues: ["recordId","bookId","borrowerId","issueDate","dueDate","returnDate","status"],
    Inventory: ["recordId","assetCode","itemName","category","quantity","location","condition","status"],
    Notices: ["recordId","title","body","audience","status","createdBy","approvedBy","publishedAt"],
    CalendarEvents: ["recordId","title","description","startDate","endDate","location","audience","status"],
    Tasks: ["recordId","title","description","assignedTo","dueDate","priority","status","createdBy","createdAt"],
    AuditLog: ["recordId","actorUid","actorRole","action","entity","entityId","timestamp","details"]
  }
};

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const expected = PropertiesService.getScriptProperties().getProperty("BJ_SHEETS_API_KEY");
    if (!expected || !body.apiKey || !constantTimeEqual_(String(body.apiKey), expected)) {
      return json_({ ok: false, error: "unauthorized" });
    }
    const result = route_(body);
    return json_({ ok: true, result: result, version: CONFIG.VERSION });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err).slice(0, 300) });
  }
}

function doGet() {
  return json_({ service: "Bal Jyoti School OS Sheets Gateway", version: CONFIG.VERSION, status: "ready" });
}

function route_(body) {
  const action = String(body.action || "");
  if (action === "setup") return setupWorkbook_();
  if (action === "listStudents") return listStudents_();
  if (action === "saveStudent") return saveStudent_(body.student || {});
  if (action === "archiveStudent") return archiveStudent_(String(body.recordId || ""));
  if (action === "seedSampleStudents") return seedSampleStudents_();
  if (action === "appendAudit") return appendAudit_(body.entry || {});
  throw new Error("Unsupported action.");
}

function setupWorkbook_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Bind this script to the School OS master spreadsheet first.");
  const created = [];
  Object.keys(CONFIG.TABS).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) { sheet = ss.insertSheet(name); created.push(name); }
    const headers = CONFIG.TABS[name];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.autoResizeColumns(1, Math.min(headers.length, 12));
    } else {
      const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (headers.some((h, i) => existing[i] !== h)) throw new Error("Header mismatch in tab " + name + ". Do not overwrite existing data.");
    }
  });
  return { spreadsheetId: ss.getId(), tabsCreated: created, tabCount: Object.keys(CONFIG.TABS).length };
}

function listStudents_() {
  const sh = sheet_("Students");
  const values = sh.getDataRange().getValues();
  const headers = values.shift() || [];
  const ix = index_(headers);
  return values.filter(r => r[ix.recordId] && r[ix.status] !== "archived").map(r => ({
    id: String(r[ix.recordId]), admissionNo: String(r[ix.admissionNo]),
    firstName: String(r[ix.firstName]), lastName: String(r[ix.lastName]),
    className: String(r[ix.className]), section: String(r[ix.section]),
    guardianName: String(r[ix.guardianName]), status: String(r[ix.status]),
    isSample: String(r[ix.isSample]).toLowerCase() === "true"
  })).slice(0, 500);
}

function saveStudent_(s) {
  const required = ["admissionNo","firstName","lastName","className","section","guardianName"];
  required.forEach(k => { s[k] = clean_(s[k], 120); if (!s[k]) throw new Error("Missing required field: " + k); });
  s.status = s.status === "inactive" ? "inactive" : "active";
  const sh = sheet_("Students"), lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const values = sh.getDataRange().getValues(), headers = values.shift() || [], ix = index_(headers);
    const now = new Date().toISOString(), id = clean_(s.id, 100) || Utilities.getUuid();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][ix.admissionNo]).toLowerCase() === s.admissionNo.toLowerCase() && String(values[i][ix.recordId]) !== id) {
        throw new Error("Admission number already exists.");
      }
    }
    const row = [id,s.admissionNo,s.firstName,s.lastName,s.className,s.section,s.guardianName,s.status,false,now,now];
    const existingIndex = values.findIndex(r => String(r[ix.recordId]) === id);
    if (existingIndex >= 0) sh.getRange(existingIndex + 2, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return { id: id, created: existingIndex < 0 };
  } finally { lock.releaseLock(); }
}

function archiveStudent_(id) {
  if (!id) throw new Error("Student record ID is required.");
  const sh = sheet_("Students"), values = sh.getDataRange().getValues(), headers = values.shift() || [], ix = index_(headers);
  const rowIndex = values.findIndex(r => String(r[ix.recordId]) === id);
  if (rowIndex < 0) throw new Error("Student not found.");
  sh.getRange(rowIndex + 2, ix.status + 1).setValue("inactive");
  sh.getRange(rowIndex + 2, ix.updatedAt + 1).setValue(new Date().toISOString());
  return { id: id, status: "inactive" };
}

function seedSampleStudents_() {
  const samples = [
    ["BJ-SAMPLE-001","Aarav","Sharma","Class V","A","Sample Guardian One"],
    ["BJ-SAMPLE-002","Ananya","Verma","Class V","A","Sample Guardian Two"],
    ["BJ-SAMPLE-003","Kabir","Singh","Class VI","B","Sample Guardian Three"],
    ["BJ-SAMPLE-004","Meera","Gupta","Class IV","A","Sample Guardian Four"],
    ["BJ-SAMPLE-005","Ishaan","Kumar","Class VII","A","Sample Guardian Five"]
  ];
  const sh = sheet_("Students"), lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const values = sh.getDataRange().getValues(), headers = values.shift() || [], ix = index_(headers);
    const known = new Set(values.map(r => String(r[ix.admissionNo])));
    const now = new Date().toISOString(), created = [];
    samples.forEach(s => {
      if (!known.has(s[0])) {
        sh.appendRow([Utilities.getUuid(),s[0],s[1],s[2],s[3],s[4],s[5],"active",true,now,now]);
        created.push(s[0]);
      }
    });
    return { created: created, totalSampleCount: samples.length };
  } finally { lock.releaseLock(); }
}

function appendAudit_(entry) {
  const sh = sheet_("AuditLog");
  const row = [Utilities.getUuid(),clean_(entry.actorUid,128),clean_(entry.actorRole,60),
    clean_(entry.action,100),clean_(entry.entity,80),clean_(entry.entityId,128),
    new Date().toISOString(),clean_(JSON.stringify(entry.details || {}),1500)];
  sh.appendRow(row);
  return { recorded: true };
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss && ss.getSheetByName(name);
  if (!sh) throw new Error("Missing tab: " + name + ". Run setup first.");
  return sh;
}
function index_(headers) { const out = {}; headers.forEach((h, i) => out[String(h)] = i); return out; }
function clean_(v, max) { return String(v == null ? "" : v).trim().replace(/\\s+/g, " ").slice(0, max); }
function constantTimeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
