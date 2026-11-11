const SHEET_ID = "1bV7n59VmzkKqsZCnht2sO0TnaoJw8nTpNk0owM7vIEU";
const TAB_NAME = "MASTER ADMISSION";
const ACTIVITY_TAB = "ADMISSION ACTIVITY LOG";
const TIME_ZONE = "Asia/Kolkata";
const FIREBASE_API_KEY = "AIzaSyB2SGgV_zUFOyOGIIM27H5HNQYlO5WdFEY";
const ALLOWED_DOMAIN = "baljyoti.com";
const ADMIN_EMAIL = "admission@baljyoti.com";

const HEADERS = [
  "Enquiry ID","Academic Year","Created Date","Created Time","Student Name",
  "Class Applied For","Age","Date of Birth","Gender","Father's Name","Mother's Name",
  "Primary Mobile","WhatsApp Number","Alternate Mobile","Parent Email","Address Line",
  "Locality","City","State","PIN Code","Annual Family Income","Admission Interest",
  "Enquiry Source","Source Detail","Campaign Name","Walk-in / Online","Lead Priority",
  "Lead Temperature","Qualification Status","Assigned Counsellor","Assigned Date",
  "First Contact Date","Contact Status","Current Stage","Enquiry Status","Last Contact Date",
  "Last Contact Outcome","Next Follow-up Date","Next Follow-up Time","Next Action",
  "Registration Status","Registration Date","Admission Decision","Admission Date",
  "Existing Admission Number (Student ID)","Existing S.R. No.","Student Status","Fee Quoted",
  "Discount Amount","Approved Fee","Booking Amount","Amount Received","Payment Status",
  "Collected By","Created By","Last Updated By","Last Updated Date","Record Remarks",
  "Duplicate Check Notes"
];

const ACTIVITY_HEADERS = [
  "Activity ID","Enquiry ID","Activity Date","Activity Time","Activity Type",
  "Outcome","Remarks","Next Follow-up Date","Next Follow-up Time","Next Action",
  "Updated By Name","Updated By Email"
];

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === "list") return listEnquiries_(p);
  return ContentService.createTextOutput("Bal Jyoti Admission CRM is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    if (!e || !e.parameter) throw new Error("No form data received.");
    const data = e.parameter;

    // Existing enquiry form submission path.
    if (!data.action || data.action === "submitEnquiry") {
      return saveNewEnquiry_(data);
    }

    const user = verifyUser_(data.idToken);
    if (data.action === "allocate") {
      if (!user.isAdmin) throw new Error("Only the Admission Incharge can allocate enquiries.");
      return allocateEnquiry_(data, user);
    }
    if (data.action === "activity") {
      return saveActivity_(data, user);
    }
    throw new Error("Unknown action.");
  } catch (error) {
    return jsonResponse_({success:false,message:error.message});
  } finally {
    try { lock.releaseLock(); } catch (err) {}
  }
}

function saveNewEnquiry_(data) {
  const required = [["studentName","Student Name"],["classApplying","Class Applied For"],
    ["mobile","Primary Mobile"],["collectedBy","Staff Name"],["collectedByEmail","Staff Email ID"]];
  required.forEach(function(f) {
    if (!String(data[f[0]] || "").trim()) throw new Error(f[1] + " is required.");
  });
  const sheet = getMasterSheet_();
  const now = new Date();
  const values = {
    "Enquiry ID":"BJ"+Utilities.formatDate(now,TIME_ZONE,"yyyyMMddHHmmss")+Utilities.getUuid().substring(0,4).toUpperCase(),
    "Academic Year":data.academicYear || "",
    "Created Date":Utilities.formatDate(now,TIME_ZONE,"dd-MM-yyyy"),
    "Created Time":Utilities.formatDate(now,TIME_ZONE,"hh:mm:ss a"),
    "Student Name":data.studentName || "",
    "Class Applied For":data.classApplying || "",
    "Age":data.age || "",
    "Father's Name":data.fatherName || "",
    "Mother's Name":data.motherName || "",
    "Primary Mobile":data.mobile || "",
    "WhatsApp Number":data.whatsapp || "",
    "Address Line":data.address || "",
    "Annual Family Income":data.annualIncome || "",
    "Admission Interest":data.admissionInterest || "",
    "Enquiry Source":data.leadSource || "",
    "Collected By":data.collectedBy || "",
    "Created By":data.collectedByEmail || "",
    "Enquiry Status":"New",
    "Current Stage":"New Enquiry",
    "Record Remarks":data.remarks || ""
  };
  appendMappedRow_(sheet, values);
  return jsonResponse_({success:true,message:"Enquiry submitted successfully.",enquiryId:values["Enquiry ID"]});
}

function listEnquiries_(p) {
  try {
    const user = verifyUser_(p.idToken);
    const sheet = getMasterSheet_();
    const values = sheet.getDataRange().getDisplayValues();
    if (values.length < 2) return jsonpResponse_(p.callback,{success:true,user:{email:user.email,isAdmin:user.isAdmin},items:[]});
    const headers = values[0];
    const rows = values.slice(1);
    const items = rows.filter(r => r[headers.indexOf("Enquiry ID")]).map(function(r) {
      const get = name => { const i=headers.indexOf(name); return i < 0 ? "" : r[i]; };
      const assigned = get("Assigned Counsellor").toLowerCase();
      const isOwner = assigned === user.email;
      const item = {
        enquiryId:get("Enquiry ID"), studentName:get("Student Name"),
        classApplying:get("Class Applied For"), academicYear:get("Academic Year"),
        assignedCounsellor:get("Assigned Counsellor"), assignedDate:get("Assigned Date"),
        currentStage:get("Current Stage") || get("Enquiry Status"),
        contactStatus:get("Contact Status"), createdDate:get("Created Date"),
        collectedBy:get("Collected By"), admissionInterest:get("Admission Interest")
      };
      if (user.isAdmin || isOwner) {
        item.mobile=get("Primary Mobile");
        item.whatsapp=get("WhatsApp Number");
        item.parentEmail=get("Parent Email");
        item.nextFollowupDate=get("Next Follow-up Date");
        item.nextFollowupTime=get("Next Follow-up Time");
        item.nextAction=get("Next Action");
        item.lastContactOutcome=get("Last Contact Outcome");
        item.recordRemarks=get("Record Remarks");
      }
      item.canWork = user.isAdmin || isOwner;
      return item;
    });
    return jsonpResponse_(p.callback,{success:true,user:{email:user.email,isAdmin:user.isAdmin},items:items});
  } catch(err) {
    return jsonpResponse_(p.callback,{success:false,message:err.message});
  }
}

function allocateEnquiry_(data,user) {
  const id=String(data.enquiryId || "").trim();
  const assignee=String(data.assignedCounsellor || "").trim().toLowerCase();
  if (!id) throw new Error("Enquiry ID is required.");
  if (!assignee || !assignee.endsWith("@"+ALLOWED_DOMAIN)) throw new Error("Enter a valid @baljyoti.com teacher email.");
  const sheet=getMasterSheet_(), map=getHeaderMap_(sheet);
  const row=findEnquiryRow_(sheet,map,id);
  if (!row) throw new Error("Enquiry not found.");
  setCell_(sheet,row,map,"Assigned Counsellor",assignee);
  setCell_(sheet,row,map,"Assigned Date",Utilities.formatDate(new Date(),TIME_ZONE,"dd-MM-yyyy"));
  setCell_(sheet,row,map,"Current Stage","Assigned for Calling");
  setCell_(sheet,row,map,"Enquiry Status","Assigned");
  setCell_(sheet,row,map,"Last Updated By",user.email);
  setCell_(sheet,row,map,"Last Updated Date",Utilities.formatDate(new Date(),TIME_ZONE,"dd-MM-yyyy HH:mm:ss"));
  logActivity_(id,"Allocation","Assigned to "+assignee,"","","","",user);
  return jsonResponse_({success:true,message:"Enquiry assigned.",enquiryId:id,assignedCounsellor:assignee});
}

function saveActivity_(data,user) {
  const id=String(data.enquiryId || "").trim();
  if (!id) throw new Error("Enquiry ID is required.");
  const sheet=getMasterSheet_(), map=getHeaderMap_(sheet);
  const row=findEnquiryRow_(sheet,map,id);
  if (!row) throw new Error("Enquiry not found.");
  const assigned=String(getCell_(sheet,row,map,"Assigned Counsellor") || "").toLowerCase();
  if (!user.isAdmin && assigned !== user.email) throw new Error("You can update only enquiries assigned to you.");
  const type=String(data.activityType || "Call").trim();
  const outcome=String(data.outcome || "").trim();
  const stage=String(data.currentStage || "").trim();
  const now=new Date();
  const date=Utilities.formatDate(now,TIME_ZONE,"dd-MM-yyyy");
  const time=Utilities.formatDate(now,TIME_ZONE,"hh:mm:ss a");
  if (outcome) setCell_(sheet,row,map,"Last Contact Outcome",outcome);
  setCell_(sheet,row,map,"Last Contact Date",date);
  if (outcome && /connected|visit scheduled|visited school/i.test(outcome) && !getCell_(sheet,row,map,"First Contact Date")) {
    setCell_(sheet,row,map,"First Contact Date",date);
  }
  setCell_(sheet,row,map,"Contact Status",outcome || "Contact Attempted");
  if (data.nextFollowupDate) setCell_(sheet,row,map,"Next Follow-up Date",data.nextFollowupDate);
  if (data.nextFollowupTime) setCell_(sheet,row,map,"Next Follow-up Time",data.nextFollowupTime);
  if (data.nextAction) setCell_(sheet,row,map,"Next Action",data.nextAction);
  if (stage) setCell_(sheet,row,map,"Current Stage",stage);
  if (data.remarks) setCell_(sheet,row,map,"Record Remarks",data.remarks);
  setCell_(sheet,row,map,"Last Updated By",user.email);
  setCell_(sheet,row,map,"Last Updated Date",Utilities.formatDate(now,TIME_ZONE,"dd-MM-yyyy HH:mm:ss"));
  logActivity_(id,type,outcome,data.remarks || "",data.nextFollowupDate || "",data.nextFollowupTime || "",data.nextAction || "",user);
  return jsonResponse_({success:true,message:"Activity saved.",enquiryId:id});
}

function verifyUser_(idToken) {
  if (!idToken) throw new Error("Please sign in again.");
  const url="https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+FIREBASE_API_KEY;
  const response=UrlFetchApp.fetch(url,{method:"post",contentType:"application/json",
    payload:JSON.stringify({idToken:idToken}),muteHttpExceptions:true});
  const result=JSON.parse(response.getContentText() || "{}");
  if (response.getResponseCode() !== 200 || !result.users || !result.users.length) throw new Error("Your school login could not be verified. Please sign in again.");
  const email=String(result.users[0].email || "").toLowerCase();
  if (!email.endsWith("@"+ALLOWED_DOMAIN)) throw new Error("Only authorised school accounts can access this module.");
  return {email:email,name:result.users[0].displayName || email.split("@")[0],isAdmin:email===ADMIN_EMAIL};
}

function getMasterSheet_() {
  const ss=SpreadsheetApp.openById(SHEET_ID);
  let sheet=ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet=ss.insertSheet(TAB_NAME);
  if (sheet.getLastRow()===0) sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
  const last=sheet.getLastColumn();
  let headers=sheet.getRange(1,1,1,last).getDisplayValues()[0];
  const normalized=headers.map(normalizeHeader);
  HEADERS.forEach(h=>{if(!normalized.includes(normalizeHeader(h))){headers.push(h);sheet.getRange(1,headers.length).setValue(h);normalized.push(normalizeHeader(h));}});
  return sheet;
}
function getHeaderMap_(sheet) {
  const h=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0], map={};
  h.forEach((v,i)=>map[normalizeHeader(v)]=i+1); return map;
}
function findEnquiryRow_(sheet,map,id) {
  const col=map[normalizeHeader("Enquiry ID")];
  if(!col || sheet.getLastRow()<2) return 0;
  const found=sheet.getRange(2,col,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext();
  return found ? found.getRow() : 0;
}
function getCell_(sheet,row,map,name) { const c=map[normalizeHeader(name)]; return c ? sheet.getRange(row,c).getDisplayValue() : ""; }
function setCell_(sheet,row,map,name,value) { const c=map[normalizeHeader(name)]; if(c) sheet.getRange(row,c).setValue(value); }
function appendMappedRow_(sheet,values) {
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0];
  sheet.appendRow(headers.map(h=>{for(const k in values) if(normalizeHeader(k)===normalizeHeader(h)) return values[k]; return "";}));
}
function logActivity_(id,type,outcome,remarks,nextDate,nextTime,nextAction,user) {
  const ss=SpreadsheetApp.openById(SHEET_ID);
  let sh=ss.getSheetByName(ACTIVITY_TAB);
  if(!sh) sh=ss.insertSheet(ACTIVITY_TAB);
  if(sh.getLastRow()===0) sh.getRange(1,1,1,ACTIVITY_HEADERS.length).setValues([ACTIVITY_HEADERS]);
  const now=new Date();
  sh.appendRow(["ACT"+Utilities.getUuid().substring(0,8).toUpperCase(),id,
    Utilities.formatDate(now,TIME_ZONE,"dd-MM-yyyy"),Utilities.formatDate(now,TIME_ZONE,"hh:mm:ss a"),
    type,outcome,remarks,nextDate,nextTime,nextAction,user.name || user.email,user.email]);
}
function normalizeHeader(value) { return String(value||"").toLowerCase().trim().replace(/[^a-z0-9]/g,""); }
function jsonResponse_(result) { return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON); }
function jsonpResponse_(callback,result) {
  const safe=/^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(callback||"") ? callback : "callback";
  return ContentService.createTextOutput(safe+"("+JSON.stringify(result)+");").setMimeType(ContentService.MimeType.JAVASCRIPT);
}
