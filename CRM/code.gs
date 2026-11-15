/** BJPS-ERP | School Management System foundation
 * Deploy as a Google Apps Script web app. Run setupDemoData() once (destructive).
 * Demo credentials are intentionally plain-text per the requested Apps Script convention.
 */
const SHEETS = Object.freeze({
  USERS:'Users', LOGS:'Logs', ROLES:'Roles', STUDENTS:'Students', TEACHERS:'Teachers',
  FEES:'FeePayments', SALARIES:'SalaryPayments', TXN:'Transactions'
});
const USER_COLS = ['Username','Email','Password','Role','Status','ProfileImage','ThemeMode','CustomColors','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy'];
const LOG_COLS = ['Timestamp','User','Action','Details'];
const ROLE_COLS = ['role_key','label','color','sort','is_super','hidden_signup','permissions'];
const STU_COLS = ['Id','AdmissionNo','Name','Class','Gender','Dob','FatherName','MotherName','GuardianPhone','Address','AdmissionDate','MonthlyFee','Status','Photo','IsDeleted','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','Section','RollNo','AcademicYear','Category','TransportRoute','TransportFee','DiscountPercent','SiblingGroup','BloodGroup','EmergencyContact','DateOfLeaving','TcIssued'];
const TCH_COLS = ['Id','Name','Phone','Email','Qualification','Designation','MonthlySalary','JoinDate','Status','Photo','IsDeleted','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','EmployeeId','Department','Subjects','ClassTeacherOf','DateOfBirth','Gender','BankAccount','Ifsc','Pan','LeaveBalance'];
const FEE_COLS = ['Id','StudentId','StudentName','FeeMonth','Amount','PaidAmount','DueAmount','Status','PaymentDate','PaymentMode','ReceiptNo','Remarks','IsDeleted','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','FeeType','DueDate','Discount','LateFee','AcademicYear','CollectedBy','TxnReference'];
const SAL_COLS = ['Id','TeacherId','TeacherName','SalaryMonth','Amount','PaidAmount','Status','PaymentDate','PaymentMode','Remarks','IsDeleted','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','Basic','Allowances','Deductions','NetPay','DaysPresent','Bonus','PayslipNo','BankReference'];
const TXN_COLS = ['Id','TxnType','Category','Amount','Description','TxnDate','IsDeleted','CreatedAt','CreatedBy','UpdatedAt','UpdatedBy','PaymentMode','Vendor','VoucherNo','AccountHead','ApprovedBy','AttachmentUrl'];
const SCHEMAS = {
  students:{sheet:SHEETS.STUDENTS,cols:STU_COLS,core:19,id:'STU'},
  teachers:{sheet:SHEETS.TEACHERS,cols:TCH_COLS,core:15,id:'TCH'},
  fees:{sheet:SHEETS.FEES,cols:FEE_COLS,core:17,id:'FEE'},
  salaries:{sheet:SHEETS.SALARIES,cols:SAL_COLS,core:15,id:'SAL'},
  transactions:{sheet:SHEETS.TXN,cols:TXN_COLS,core:11,id:'TXN'}
};
const RBAC_PAGES = [
  {key:'dashboard',label:'Dashboard',group:'General'},
  {key:'students',label:'Students',group:'Academics'},{key:'teachers',label:'Teachers',group:'Academics'},
  {key:'fees',label:'Fees',group:'Finance'},{key:'salaries',label:'Salaries',group:'Finance'},
  {key:'income_expense',label:'Income / Expense',group:'Finance'},
  {key:'inventory',label:'Inventory',group:'Inventory'},{key:'stock',label:'Stock',group:'Inventory'},
  {key:'pos',label:'POS',group:'Inventory'},{key:'vendors',label:'Vendors',group:'Inventory'},
  {key:'users',label:'Users',group:'System'},{key:'settings',label:'Settings',group:'System'},{key:'logs',label:'Logs',group:'System'}
];
const TEXT_COLS = {Students:['Dob','AdmissionDate','DateOfLeaving'],Teachers:['JoinDate','DateOfBirth'],FeePayments:['FeeMonth','PaymentDate','DueDate'],SalaryPayments:['SalaryMonth','PaymentDate'],Transactions:['TxnDate']};
const THEME_PRESETS = {
  navy:{primary:'#001f3f',light:'#003366',accent:'#0074D9',success:'#34a853',warning:'#fbbc04',danger:'#ea4335'},
  ocean:{primary:'#073b4c',light:'#0b5268',accent:'#118ab2',success:'#06a77d',warning:'#f4a261',danger:'#e63946'},
  forest:{primary:'#173b2b',light:'#285943',accent:'#2a9d8f',success:'#34a853',warning:'#e9c46a',danger:'#e76f51'},
  slate:{primary:'#263445',light:'#3c5068',accent:'#4776a8',success:'#34a853',warning:'#fbbc04',danger:'#ea4335'}
};
function ok_(o){return {ok:true,data:o};}
function err_(m){return {ok:false,error:String(m||'Unexpected error')};}
function ss_(){return SpreadsheetApp.getActiveSpreadsheet();}
function sh_(name){const s=ss_().getSheetByName(name); if(!s) throw new Error('Missing sheet: '+name); return s;}
function rows_(name){const s=sh_(name), v=s.getDataRange().getValues(); if(!v.length) return {sh:s,data:[]}; const h=v.shift().map(String); return {sh:s,data:v.filter(r=>r.some(x=>x!==''&&x!==null)).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])))};}
function findRow_(data,col,val){return data.findIndex(r=>String(r[col])===String(val));}
function nextId_(data,col){return data.reduce((m,r)=>Math.max(m,Number(r[col])||0),0)+1;}
function nowIso_(){return new Date().toISOString();}
function iso_(v){if(!v)return ''; if(v instanceof Date)return v.toISOString(); const d=new Date(v); return isNaN(d)?String(v):d.toISOString();}
function ym_(v){if(v===null||v===undefined||v==='')return ''; if(v instanceof Date)return Utilities.formatDate(v,Session.getScriptTimeZone(),'yyyy-MM'); const s=String(v); const m=s.match(/^(\d{4})-(\d{2})/); if(m)return m[1]+'-'+m[2]; const d=new Date(v); return isNaN(d)?'':Utilities.formatDate(d,Session.getScriptTimeZone(),'yyyy-MM');}
function isoDate_(v){if(v===null||v===undefined||v==='')return ''; if(v instanceof Date)return Utilities.formatDate(v,Session.getScriptTimeZone(),"yyyy-MM-dd")+'T00:00:00Z'; const s=String(v); if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10)+'T00:00:00Z'; const d=new Date(v); return isNaN(d)?'':Utilities.formatDate(d,Session.getScriptTimeZone(),"yyyy-MM-dd")+'T00:00:00Z';}
function addLog(user,action,details){const s=ss_().getSheetByName(SHEETS.LOGS); if(s)s.appendRow([nowIso_(),user||'system',action,typeof details==='string'?details:JSON.stringify(details||{})]);}
function classFee_(cls){return ['Nursery','LKG','UKG'].includes(cls)?650:['Class I','Class II','Class III'].includes(cls)?700:0;}
function feeNet_(amount,discount,lateFee){return Number(amount||0)-Number(discount||0)+Number(lateFee||0);}
function feeDue_(net,paid){return Number(net||0)-Number(paid||0);}
function feeStatus_(net,paid){paid=Number(paid||0);net=Number(net||0);return paid<=0?'Due':paid<net?'Partial':'Paid';}
function salaryNet_(amount,basic,allow,bonus,deduct){amount=Number(amount||0);basic=Number(basic||0);allow=Number(allow||0);bonus=Number(bonus||0);deduct=Number(deduct||0);return (basic||allow||bonus)?basic+allow+bonus-deduct:amount-deduct;}
function salStatus_(net,paid){paid=Number(paid||0);net=Number(net||0);return paid<=0?'Unpaid':paid<net?'Partial':'Paid';}
function rbacDefaultPerms_(roleKey){
  const p={}; RBAC_PAGES.forEach(x=>p[x.key]={view:false,add:false,edit:false,delete:false});
  if(roleKey==='super_admin'){RBAC_PAGES.forEach(x=>p[x.key]={view:true,add:!['dashboard','logs'].includes(x.key),edit:!['dashboard','logs'].includes(x.key),delete:!['dashboard','logs'].includes(x.key)});}
  if(roleKey==='admin'){
    ['students','fees','inventory','stock','pos','vendors','income_expense'].forEach(k=>p[k]={view:true,add:true,edit:true,delete:false});
    ['teachers','salaries'].forEach(k=>p[k]={view:true,add:false,edit:false,delete:false});
    p.dashboard={view:true,add:false,edit:false,delete:false};
  }
  return p;
}
function mergedPerms_(role){
  const key=typeof role==='string'?role:role&&role.role_key;
  let stored={}; try{stored=typeof role==='object'&&role.permissions?JSON.parse(role.permissions):{};}catch(e){}
  const base=rbacDefaultPerms_(key), out={};
  Object.keys(base).forEach(k=>{out[k]={...base[k],...(stored[k]||{})};});
  Object.keys(stored).forEach(k=>{if(!out[k])out[k]={view:false,add:false,edit:false,delete:false,...stored[k]};});
  return out;
}
function roleRecord_(roleKey){const {data}=rows_(SHEETS.ROLES);return data.find(r=>r.role_key===roleKey)||null;}
function rbacPermsFor_(role){return mergedPerms_(role);}
function hasPerm_(role,page,perm){const p=mergedPerms_(role)[page];return !!(p&&p[perm]);}
function currentUser_(caller){const {data}=rows_(SHEETS.USERS);return data.find(u=>String(u.Username).toLowerCase()===String(caller||'').toLowerCase()&&u.Status==='Active')||null;}
function gate_(caller,page,perm){
  const u=currentUser_(caller); if(!u)throw new Error('Authentication required or account inactive.');
  const role=roleRecord_(u.Role); if(!role||!hasPerm_(role,page,perm))throw new Error('Permission denied: '+perm+' '+page);
  return u;
}
function rbacCanEdit_(u){return !!u&&u.Role==='super_admin';}
function serializeRow_(obj,schema){
  const out={...obj};
  ['Dob','AdmissionDate','DateOfLeaving','JoinDate','DateOfBirth','PaymentDate','DueDate','TxnDate'].forEach(k=>{if(k in out)out[k]=isoDate_(out[k]);});
  ['FeeMonth','SalaryMonth'].forEach(k=>{if(k in out)out[k]=ym_(out[k]);});
  Object.keys(out).forEach(k=>{if(out[k] instanceof Date && !['FeeMonth','SalaryMonth'].includes(k))out[k]=iso_(out[k]);});
  return out;
}
function getRbacMatrix(caller){gate_(caller,'settings','view');const {data}=rows_(SHEETS.ROLES);return ok_(data.map(r=>({...r,permissions:mergedPerms_(r)})));}
function toggleRbac(roleKey,page,perm,value,caller){
  const u=gate_(caller,'settings','edit');if(u.Role!=='super_admin')throw new Error('Only Super Admin can edit roles.');
  if(roleKey==='super_admin')throw new Error('Super Admin is locked.');
  if(!['view','add','edit','delete'].includes(perm)||!RBAC_PAGES.some(p=>p.key===page))throw new Error('Invalid permission.');
  if(['dashboard','logs'].includes(page)&&perm!=='view')throw new Error('Dashboard and Logs are view-only pages.');
  const {sh,data}=rows_(SHEETS.ROLES),i=findRow_(data,'role_key',roleKey);if(i<0)throw new Error('Role not found.');
  const p=mergedPerms_(data[i]);p[page][perm]=!!value;sh.getRange(i+2,7).setValue(JSON.stringify(p));addLog(caller,'RBAC_UPDATE',{roleKey,page,perm,value:!!value});return ok_(p);
}
function normalizeForWrite_(obj,schema){
  const o={...obj};
  ['Dob','AdmissionDate','DateOfLeaving','JoinDate','DateOfBirth','PaymentDate','DueDate','TxnDate'].forEach(k=>{if(k in o)o[k]=isoDate_(o[k]);});
  ['FeeMonth','SalaryMonth'].forEach(k=>{if(k in o)o[k]=ym_(o[k]);});
  ['MonthlyFee','TransportFee','DiscountPercent','MonthlySalary','Amount','PaidAmount','DueAmount','Discount','LateFee','Basic','Allowances','Deductions','NetPay','DaysPresent','Bonus','LeaveBalance'].forEach(k=>{if(k in o)o[k]=Number(o[k]||0);});
  return o;
}
function objToRow_(obj,cols){return cols.map(c=>obj[c]===undefined?'':obj[c]);}
function readEntity_(obj,schema){return serializeRow_(obj,schema);}
function listEntity_(kind,caller){
  const s=SCHEMAS[kind], page=kind==='transactions'?'income_expense':kind; gate_(caller,page,'view');
  const {data}=rows_(s.sheet);let result=data.map(r=>readEntity_(r,s)).filter(r=>String(r.IsDeleted)!=='TRUE'&&r.IsDeleted!==true);
  if(kind==='fees'){const st=rows_(SHEETS.STUDENTS).data;result=result.map(r=>{const x=st.find(v=>String(v.Id)===String(r.StudentId))||{};return {...r,AdmissionNo:x.AdmissionNo||'',Class:x.Class||'',FatherName:x.FatherName||'',RollNo:x.RollNo||''};});}
  if(kind==='salaries'){const ts=rows_(SHEETS.TEACHERS).data;result=result.map(r=>{const x=ts.find(v=>String(v.Id)===String(r.TeacherId))||{};return {...r,EmployeeId:x.EmployeeId||'',Designation:x.Designation||'',Department:x.Department||'',JoinDate:isoDate_(x.JoinDate),BankAccount:x.BankAccount||''};});}
  return ok_(result);
}
function duplicateCheck_(kind,o,data,selfId){
  if(kind==='fees'||kind==='salaries'){
    const idKey=kind==='fees'?'StudentId':'TeacherId',monthKey=kind==='fees'?'FeeMonth':'SalaryMonth';
    const hit=data.find(r=>String(r.IsDeleted)!=='TRUE'&&r.IsDeleted!==true&&String(r[idKey])===String(o[idKey])&&ym_(r[monthKey])===ym_(o[monthKey])&&String(r.Id)!==String(selfId||''));
    if(hit)throw new Error('A payment already exists for this '+(kind==='fees'?'student':'teacher')+' and month.');
  }
}
function addEntity_(kind,payload,caller){
  const s=SCHEMAS[kind],page=kind==='transactions'?'income_expense':kind;const u=gate_(caller,page,'add');
  const {sh,data}=rows_(s.sheet),o=normalizeForWrite_(payload,s),id=nextId_(data,'Id');
  o.Id=id;o.IsDeleted=false;o.CreatedAt=nowIso_();o.CreatedBy=caller;o.UpdatedAt=o.CreatedAt;o.UpdatedBy=caller;
  if(kind==='students'){if(!o.AdmissionNo)o.AdmissionNo='ADM-'+id;if(!o.MonthlyFee)o.MonthlyFee=classFee_(o.Class);}
  if(kind==='teachers'&&!o.EmployeeId)o.EmployeeId='EMP-'+id;
  if(kind==='fees'){duplicateCheck_(kind,o,data);const net=feeNet_(o.Amount,o.Discount,o.LateFee);o.DueAmount=feeDue_(net,o.PaidAmount);o.Status=feeStatus_(net,o.PaidAmount);if(!o.ReceiptNo)o.ReceiptNo='RCPT-'+id;}
  if(kind==='salaries'){duplicateCheck_(kind,o,data);o.NetPay=salaryNet_(o.Amount,o.Basic,o.Allowances,o.Bonus,o.Deductions);o.Status=salStatus_(o.NetPay,o.PaidAmount);if(!o.PayslipNo)o.PayslipNo='PS-'+id;}
  if(kind==='transactions'&&!o.VoucherNo)o.VoucherNo='VCH-'+id;
  sh.appendRow(objToRow_(o,s.cols));addLog(caller,'CREATE_'+kind.toUpperCase(),{id});return ok_(readEntity_(o,s));
}
function updateEntity_(kind,id,payload,caller){
  const s=SCHEMAS[kind],page=kind==='transactions'?'income_expense':kind;const u=gate_(caller,page,'edit');
  const {sh,data}=rows_(s.sheet),i=findRow_(data,'Id',id);if(i<0||data[i].IsDeleted===true||String(data[i].IsDeleted)==='TRUE')throw new Error('Record not found.');
  const old=data[i],o=normalizeForWrite_({...old,...payload,Id:Number(id),UpdatedAt:nowIso_(),UpdatedBy:caller},s);
  if(kind==='fees'){duplicateCheck_(kind,o,data,id);const net=feeNet_(o.Amount,o.Discount,o.LateFee);o.DueAmount=feeDue_(net,o.PaidAmount);o.Status=feeStatus_(net,o.PaidAmount);}
  if(kind==='salaries'){duplicateCheck_(kind,o,data,id);o.NetPay=salaryNet_(o.Amount,o.Basic,o.Allowances,o.Bonus,o.Deductions);o.Status=salStatus_(o.NetPay,o.PaidAmount);}
  // Core (through audit tail) and growth tail are deliberately separate contiguous writes.
  sh.getRange(i+2,1,1,s.core).setValues([objToRow_(o,s.cols).slice(0,s.core)]);
  if(s.cols.length>s.core)sh.getRange(i+2,s.core+1,1,s.cols.length-s.core).setValues([objToRow_(o,s.cols).slice(s.core)]);
  addLog(caller,'UPDATE_'+kind.toUpperCase(),{id});return ok_(readEntity_(o,s));
}
function deleteEntity_(kind,id,caller){
  const s=SCHEMAS[kind],page=kind==='transactions'?'income_expense':kind;gate_(caller,page,'delete');
  const {sh,data}=rows_(s.sheet),i=findRow_(data,'Id',id);if(i<0)throw new Error('Record not found.');
  sh.getRange(i+2,15<=s.cols.length&&kind==='students'?15:kind==='teachers'?11:kind==='fees'?13:kind==='salaries'?11:7).setValue(true);
  sh.getRange(i+2,kind==='students'?18:kind==='teachers'?14:kind==='fees'?16:kind==='salaries'?14:10).setValue(nowIso_());
  sh.getRange(i+2,kind==='students'?19:kind==='teachers'?15:kind==='fees'?17:kind==='salaries'?15:11).setValue(caller);
  addLog(caller,'DELETE_'+kind.toUpperCase(),{id,soft:true});return ok_(true);
}
function wrap_(fn){try{return fn();}catch(e){return err_(e.message||e);}}
function getStudents(c){return wrap_(()=>{gate_(c,'students','view');return listEntity_('students',c);});} function addStudent(o,c){return wrap_(()=>{gate_(c,'students','add');return addEntity_('students',o,c);});} function updateStudent(id,o,c){return wrap_(()=>{gate_(c,'students','edit');return updateEntity_('students',id,o,c);});} function deleteStudent(id,c){return wrap_(()=>{gate_(c,'students','delete');return deleteEntity_('students',id,c);});}
function getTeachers(c){return wrap_(()=>{gate_(c,'teachers','view');return listEntity_('teachers',c);});} function addTeacher(o,c){return wrap_(()=>{gate_(c,'teachers','add');return addEntity_('teachers',o,c);});} function updateTeacher(id,o,c){return wrap_(()=>{gate_(c,'teachers','edit');return updateEntity_('teachers',id,o,c);});} function deleteTeacher(id,c){return wrap_(()=>{gate_(c,'teachers','delete');return deleteEntity_('teachers',id,c);});}
function getFees(c){return wrap_(()=>{gate_(c,'fees','view');return listEntity_('fees',c);});} function addFee(o,c){return wrap_(()=>{gate_(c,'fees','add');return addEntity_('fees',o,c);});} function updateFee(id,o,c){return wrap_(()=>{gate_(c,'fees','edit');return updateEntity_('fees',id,o,c);});} function deleteFee(id,c){return wrap_(()=>{gate_(c,'fees','delete');return deleteEntity_('fees',id,c);});}
function getSalaries(c){return wrap_(()=>{gate_(c,'salaries','view');return listEntity_('salaries',c);});} function addSalary(o,c){return wrap_(()=>{gate_(c,'salaries','add');return addEntity_('salaries',o,c);});} function updateSalary(id,o,c){return wrap_(()=>{gate_(c,'salaries','edit');return updateEntity_('salaries',id,o,c);});} function deleteSalary(id,c){return wrap_(()=>{gate_(c,'salaries','delete');return deleteEntity_('salaries',id,c);});}
function getTransactions(c){return wrap_(()=>{gate_(c,'income_expense','view');return listEntity_('transactions',c);});} function addTransaction(o,c){return wrap_(()=>{gate_(c,'income_expense','add');return addEntity_('transactions',o,c);});} function updateTransaction(id,o,c){return wrap_(()=>{gate_(c,'income_expense','edit');return updateEntity_('transactions',id,o,c);});} function deleteTransaction(id,c){return wrap_(()=>{gate_(c,'income_expense','delete');return deleteEntity_('transactions',id,c);});}
function authenticateUser(username,password){
  const {data}=rows_(SHEETS.USERS),u=data.find(x=>String(x.Username).toLowerCase()===String(username||'').toLowerCase());
  if(!u){addLog(username,'LOGIN_FAILED','unknown user');return err_('Unknown username.');}
  if(u.Status!=='Active'){addLog(username,'LOGIN_FAILED','inactive account');return err_('This account is inactive.');}
  if(String(u.Password)!==String(password)){addLog(username,'LOGIN_FAILED','bad password');return err_('Incorrect password.');}
  const role=roleRecord_(u.Role);addLog(username,'LOGIN_SUCCESS','');return ok_({username:u.Username,email:u.Email,role:u.Role,profileImage:u.ProfileImage,themeMode:u.ThemeMode||'light',customColors:u.CustomColors||'',permissions:mergedPerms_(role),canEditRbac:rbacCanEdit_(u)});
}
function getUserSettings(c){return wrap_(()=>{gate_(c,'dashboard','view');const u=currentUser_(c);return ok_({themeMode:u.ThemeMode||'light',customColors:u.CustomColors||''});});}
function updateUserSettings(settings,c){return wrap_(()=>{const u=gate_(c,'dashboard','view');const {sh,data}=rows_(SHEETS.USERS),i=findRow_(data,'Username',c);sh.getRange(i+2,7,1,2).setValues([[settings.themeMode||'light',settings.customColors||'']]);sh.getRange(i+2,11,1,2).setValues([[nowIso_(),c]]);addLog(c,'UPDATE_USER_SETTINGS',settings);return ok_(true);});}
function setAppDefaultTheme(theme,c){return wrap_(()=>{gate_(c,'settings','edit');if(!['navy','ocean','forest','slate'].includes(theme))throw new Error('Invalid theme.');PropertiesService.getScriptProperties().setProperty('APP_DEFAULT_THEME',theme);addLog(c,'SET_DEFAULT_THEME',theme);return ok_(true);});}
function getLogs(c){return wrap_(()=>{gate_(c,'logs','view');const {data}=rows_(SHEETS.LOGS);return ok_(data.slice(-250).reverse());});}
function getNotificationCount(c){return wrap_(()=>{gate_(c,'dashboard','view');const {data}=rows_(SHEETS.LOGS);const since=Date.now()-7*24*60*60*1000;const count=data.filter(x=>{const d=new Date(x.Timestamp).getTime();return Number.isFinite(d)&&d>=since;}).length;return ok_({count});});}
function getDashboardStats(c){return wrap_(()=>{gate_(c,'dashboard','view');const students=rows_(SHEETS.STUDENTS).data.filter(x=>!x.IsDeleted&&x.Status==='Active').length,teachers=rows_(SHEETS.TEACHERS).data.filter(x=>!x.IsDeleted&&x.Status==='Active').length,fees=rows_(SHEETS.FEES).data.filter(x=>!x.IsDeleted),pending=fees.reduce((a,x)=>a+Math.max(0,Number(x.DueAmount)||0),0),income=rows_(SHEETS.TXN).data.filter(x=>!x.IsDeleted&&x.TxnType==='Income').reduce((a,x)=>a+Number(x.Amount||0),0);return ok_({students,teachers,pending,income});});}
function addFamilyFees(payload,caller){
  return wrap_(()=>{const u=gate_(caller,'fees','add'),{sh,data}=rows_(SHEETS.FEES),students=rows_(SHEETS.STUDENTS).data;
    const month=ym_(payload.month),date=isoDate_(payload.paymentDate),mode=payload.paymentMode||'Cash',created=[],existing=new Set(data.filter(x=>!x.IsDeleted).map(x=>String(x.StudentId)+'|'+ym_(x.FeeMonth)));
    const rows=[];let id=nextId_(data,'Id');
    (payload.children||[]).filter(x=>x.checked!==false).forEach(ch=>{if(existing.has(String(ch.Id)+'|'+month))return;const st=students.find(s=>String(s.Id)===String(ch.Id));if(!st) return;
      const amount=Number(ch.amount||st.MonthlyFee||0),discount=Number(ch.discount||0),late=0,net=feeNet_(amount,discount,late),paid=Number(ch.paidAmount===undefined?net:ch.paidAmount);
      const o={Id:id++,StudentId:st.Id,StudentName:st.Name,FeeMonth:month,Amount:amount,PaidAmount:paid,DueAmount:feeDue_(net,paid),Status:feeStatus_(net,paid),PaymentDate:date,PaymentMode:mode,ReceiptNo:'RCPT-'+(id-1),Remarks:'Family fee collection',IsDeleted:false,CreatedAt:nowIso_(),CreatedBy:caller,UpdatedAt:nowIso_(),UpdatedBy:caller,FeeType:'Tuition',DueDate:isoDate_(payload.dueDate),Discount:discount,LateFee:late,AcademicYear:st.AcademicYear||'',CollectedBy:caller,TxnReference:''};
      rows.push(objToRow_(o,FEE_COLS));created.push(readEntity_(o,SCHEMAS.fees));
    });
    if(rows.length)sh.getRange(sh.getLastRow()+1,1,rows.length,FEE_COLS.length).setValues(rows);addLog(caller,'CREATE_FAMILY_FEES',{month,count:rows.length});return ok_(created);
  });
}
function doGet(){
  const t=HtmlService.createTemplateFromFile('index');
  t.APP_DEFAULT_THEME=PropertiesService.getScriptProperties().getProperty('APP_DEFAULT_THEME')||'navy';
  const themeKey=t.APP_DEFAULT_THEME;t.APP_THEME=THEME_PRESETS[themeKey]||THEME_PRESETS.navy;
  return t.evaluate().setTitle('School Management System').addMetaTag('viewport','width=device-width, initial-scale=1');
}
function include(filename){return HtmlService.createHtmlOutputFromFile(filename).getContent();}
function setupDemoData(){
  const ss=ss_(),tmp=ss.insertSheet('_TEMP_REBUILD_'+Date.now());
  ss.getSheets().forEach(s=>{if(s.getSheetId()!==tmp.getSheetId())ss.deleteSheet(s);});
  const defs=[[SHEETS.USERS,USER_COLS],[SHEETS.LOGS,LOG_COLS],[SHEETS.ROLES,ROLE_COLS],[SHEETS.STUDENTS,STU_COLS],[SHEETS.TEACHERS,TCH_COLS],[SHEETS.FEES,FEE_COLS],[SHEETS.SALARIES,SAL_COLS],[SHEETS.TXN,TXN_COLS]];
  defs.forEach(([name,cols])=>{const s=ss.insertSheet(name);s.getRange(1,1,1,cols.length).setValues([cols]).setBackground('#001f3f').setFontColor('#ffffff').setFontWeight('bold');s.setFrozenRows(1);s.getRange(1,1,s.getMaxRows(),cols.length).setVerticalAlignment('middle');});
  const now=nowIso_(),users=[
    ['superadmin','superadmin@example.test','admin123','super_admin','Active','','light','',''+now,'system',now,'system'],
    ['admin','admin@example.test','admin123','admin','Active','','light','',''+now,'system',now,'system'],
    ['admin2','admin2@example.test','admin123','admin','Active','','light','',''+now,'system',now,'system'],
    ['admin3','admin3@example.test','admin123','admin','Inactive','','light','',''+now,'system',now,'system']
  ];
  ss.getSheetByName(SHEETS.USERS).getRange(2,1,users.length,USER_COLS.length).setValues(users);
  const roles=[['super_admin','Super Admin','#001f3f',1,true,true,JSON.stringify(rbacDefaultPerms_('super_admin'))],['admin','Admin','#0074D9',2,false,false,JSON.stringify(rbacDefaultPerms_('admin'))]];
  ss.getSheetByName(SHEETS.ROLES).getRange(2,1,roles.length,ROLE_COLS.length).setValues(roles);
  const students=[];for(let i=1;i<=8;i++){const cls=['Nursery','LKG','UKG','Class I','Class II','Class III'][i%6];const status=i===4?'Inactive':i===7?'Left':'Active';const o={Id:i,AdmissionNo:'ADM-'+i,Name:'Student '+String(i).padStart(2,'0'),Class:cls,Gender:i%2?'Male':'Female',Dob:'2016-01-01T00:00:00Z',FatherName:'Parent '+i,MotherName:'Parent '+i,GuardianPhone:'DEMO-PHONE-'+String(i).padStart(2,'0'),Address:'Demo Address',AdmissionDate:'2024-04-01T00:00:00Z',MonthlyFee:classFee_(cls),Status:status,Photo:'',IsDeleted:false,CreatedAt:now,CreatedBy:'system',UpdatedAt:now,UpdatedBy:'system',Section:'A',RollNo:i,AcademicYear:'2026-27',Category:'General',TransportRoute:'',TransportFee:0,DiscountPercent:0,SiblingGroup:i<3?'FAM-1':'',BloodGroup:'',EmergencyContact:'',DateOfLeaving:'',TcIssued:false};students.push(objToRow_(o,STU_COLS));}
  ss.getSheetByName(SHEETS.STUDENTS).getRange(2,1,students.length,STU_COLS.length).setValues(students);
  const teachers=[];for(let i=1;i<=5;i++){const o={Id:i,Name:'Teacher '+String(i).padStart(2,'0'),Phone:'DEMO-PHONE-'+String(i).padStart(2,'0'),Email:'teacher'+i+'@example.test',Qualification:'Graduate',Designation:i===1?'Coordinator':'Teacher',MonthlySalary:18000+i*1000,JoinDate:'2023-04-01T00:00:00Z',Status:i===5?'Inactive':'Active',Photo:'',IsDeleted:false,CreatedAt:now,CreatedBy:'system',UpdatedAt:now,UpdatedBy:'system',EmployeeId:'EMP-'+i,Department:'Academics',Subjects:'General',ClassTeacherOf:'',DateOfBirth:'1990-01-01T00:00:00Z',Gender:'',BankAccount:'',Ifsc:'',Pan:'',LeaveBalance:12};teachers.push(objToRow_(o,TCH_COLS));}
  ss.getSheetByName(SHEETS.TEACHERS).getRange(2,1,teachers.length,TCH_COLS.length).setValues(teachers);
  Object.keys(TEXT_COLS).forEach(n=>{const s=ss.getSheetByName(n),cols=TEXT_COLS[n];cols.forEach(c=>{const i=(n==='Students'?STU_COLS:n==='Teachers'?TCH_COLS:n==='FeePayments'?FEE_COLS:n==='SalaryPayments'?SAL_COLS:TXN_COLS).indexOf(c)+1;if(i>0)s.getRange(2,i,Math.max(1,s.getMaxRows()-1),1).setNumberFormat('@');});});
  ss.deleteSheet(tmp);PropertiesService.getScriptProperties().setProperty('APP_DEFAULT_THEME','navy');addLog('system','SETUP_DEMO_DATA','Fresh demo workbook created');return 'Demo data ready. Login: superadmin/admin123 or admin/admin123';
}
