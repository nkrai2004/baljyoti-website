const FEE_KEY="aarikaFeeHeads",STRUCT_KEY="aarikaFeeStructures",ASSIGN_KEY="aarikaFeeAssignments",PAY_KEY="aarikaFeePayments";
const DEMO_HEADS=[
{id:"FH-001",name:"Tuition Fee",frequency:"Annual",status:"ACTIVE"},
{id:"FH-002",name:"Transport Fee",frequency:"Monthly",status:"ACTIVE"},
{id:"FH-003",name:"Annual Charges",frequency:"Annual",status:"ACTIVE"},
{id:"FH-004",name:"Examination Fee",frequency:"Term",status:"ACTIVE"}
];
function arr(k,d=[]){try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch(e){return d}}
function put(k,v){localStorage.setItem(k,JSON.stringify(v))}
function feeSeed(){if(!localStorage.getItem(FEE_KEY))put(FEE_KEY,DEMO_HEADS);if(!localStorage.getItem(STRUCT_KEY))put(STRUCT_KEY,[]);if(!localStorage.getItem(ASSIGN_KEY),put(ASSIGN_KEY,[]),!localStorage.getItem(PAY_KEY))put(PAY_KEY,[])}
function heads(){return arr(FEE_KEY)} function structures(){return arr(STRUCT_KEY)} function assignments(){return arr(ASSIGN_KEY)} function payments(){return arr(PAY_KEY)}
function classes(){return arr("aarikaClasses")} function students(){return arr("aarikaStudents")}
function escF(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function classNameF(id){const c=classes().find(x=>x.id===id);return c?`Class ${c.name}-${c.section}`:"—"}
function studentNameF(id){const s=students().find(x=>x.id===id);return s?s.firstName+" "+s.lastName:"—"}
function renderFeeDashboard(){
 const as=assignments(),ps=payments(),total=as.reduce((n,x)=>n+Number(x.amount||0),0),paid=ps.reduce((n,x)=>n+Number(x.amount||0),0);
 document.getElementById("feeAssigned").textContent=as.length;document.getElementById("feeCollected").textContent="₹"+paid.toLocaleString("en-IN");document.getElementById("feeOutstanding").textContent="₹"+Math.max(0,total-paid).toLocaleString("en-IN");
 const root=document.getElementById("feeRows");if(!root)return;
 root.innerHTML=as.slice().reverse().map(a=>{const p=ps.filter(x=>x.assignmentId===a.id).reduce((n,x)=>n+Number(x.amount||0),0),bal=Math.max(0,a.amount-p);return `<tr><td><b>${escF(studentNameF(a.studentId))}</b><small>${escF(a.admissionNo||"")}</small></td><td>${escF(a.feeHeadName)}</td><td>₹${Number(a.amount).toLocaleString("en-IN")}</td><td>₹${p.toLocaleString("en-IN")}</td><td>₹${bal.toLocaleString("en-IN")}</td><td><button class="linkbtn" onclick="location.href='fee-student.html?id=${encodeURIComponent(a.studentId)}'">Open</button></td></tr>`}).join("")||'<tr><td colspan="6" class="muted">No fee assignments yet.</td></tr>';
}
function prepareAssignment(){
 const s=document.getElementById("feeStudent"),h=document.getElementById("feeHead");
 if(s)s.innerHTML='<option value="">Select student</option>'+students().map(x=>`<option value="${x.id}">${escF(x.firstName+" "+x.lastName)} — ${escF(x.admissionNo||"")}</option>`).join("");
 if(h)h.innerHTML='<option value="">Select fee head</option>'+heads().map(x=>`<option value="${x.id}">${escF(x.name)}</option>`).join("");
}
function createAssignment(e){
 e.preventDefault();const f=e.target,s=students().find(x=>x.id===f.studentId.value),h=heads().find(x=>x.id===f.feeHeadId.value);
 if(!s||!h||!f.amount.value){alert("Complete student, fee head and amount.");return}
 const a={id:"FA-"+Date.now(),studentId:s.id,admissionNo:s.admissionNo||"",feeHeadId:h.id,feeHeadName:h.name,amount:Number(f.amount.value),dueDate:f.dueDate.value||"",status:"DUE"};
 const all=assignments();all.push(a);put(ASSIGN_KEY,all);location.href="fee-student.html?id="+encodeURIComponent(s.id);
}
function renderStudentFees(){
 const id=new URLSearchParams(location.search).get("id"),s=students().find(x=>x.id===id),root=document.getElementById("studentFees");
 if(!s){root.innerHTML='<div class="card"><h2>Student not found</h2></div>';return}
 document.getElementById("studentFeeName").textContent=s.firstName+" "+s.lastName;document.getElementById("studentFeeMeta").textContent=`${s.admissionNo||""} • Class ${s.className||"—"}-${s.section||"—"}`;
 const as=assignments().filter(a=>a.studentId===id),ps=payments();
 root.innerHTML=as.map(a=>{const paid=ps.filter(x=>x.assignmentId===a.id).reduce((n,x)=>n+Number(x.amount||0),0),bal=Math.max(0,a.amount-paid);return `<div class="fee-card"><div><b>${escF(a.feeHeadName)}</b><small>Due ${escF(a.dueDate||"Not set")}</small></div><div><span>Total ₹${a.amount.toLocaleString("en-IN")}</span><span>Paid ₹${paid.toLocaleString("en-IN")}</span><strong>Balance ₹${bal.toLocaleString("en-IN")}</strong></div><button class="linkbtn" onclick="collectPayment('${a.id}')">Collect</button></div>`}).join("")||'<p class="muted">No fee assignments for this student.</p>';
}
function collectPayment(id){
 const a=assignments().find(x=>x.id===id),paid=payments().filter(x=>x.assignmentId===id).reduce((n,x)=>n+Number(x.amount||0),0),bal=Math.max(0,a.amount-paid);
 const value=prompt(`Outstanding: ₹${bal}. Enter payment amount:`,bal);
 if(value===null)return;const amount=Number(value);if(!amount||amount<=0||amount>bal){alert("Enter a valid amount up to the outstanding balance.");return}
 const p={id:"PAY-"+Date.now(),assignmentId:id,studentId:a.studentId,amount,date:new Date().toISOString().slice(0,10),receipt:"RCP-"+Date.now().toString().slice(-8)};
 const all=payments();all.push(p);put(PAY_KEY,all);renderStudentFees();
}
function renderFeeHeads(){
 const root=document.getElementById("feeHeadRows");if(!root)return;
 root.innerHTML=heads().map(h=>`<tr><td><b>${escF(h.name)}</b></td><td>${escF(h.frequency)}</td><td><span class="status">${h.status}</span></td></tr>`).join("");
}
function addFeeHead(e){e.preventDefault();const f=e.target;if(!f.name.value.trim())return;const x=heads();x.push({id:"FH-"+Date.now(),name:f.name.value.trim(),frequency:f.frequency.value,status:"ACTIVE"});put(FEE_KEY,x);location.href="fee-heads.html"}
feeSeed();
