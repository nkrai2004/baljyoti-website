const AK="aarikaAdmissions";
function ax(){try{return JSON.parse(localStorage.getItem(AK)||"null")||[]}catch(e){return[]}}
function aw(v){localStorage.setItem(AK,JSON.stringify(v))}
function ae(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderAdmissions(){
 const a=ax(),q=(document.getElementById("admissionSearch")?.value||"").toLowerCase(),r=document.getElementById("admissionRows");
 const f=a.filter(x=>(x.applicationNo+" "+x.studentName+" "+x.classApplied+" "+x.parentName+" "+x.status).toLowerCase().includes(q));
 document.getElementById("applicationCount").textContent=a.length;
 document.getElementById("newCount").textContent=a.filter(x=>x.status==="NEW").length;
 document.getElementById("approvedCount").textContent=a.filter(x=>x.status==="APPROVED").length;
 document.getElementById("enrolledCount").textContent=a.filter(x=>x.status==="ENROLLED").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${ae(x.applicationNo)}</b><small>${ae(x.applicationDate)}</small></td><td><b>${ae(x.studentName)}</b><small>${ae(x.gender)} · ${ae(x.dob)}</small></td><td>${ae(x.classApplied)}</td><td>${ae(x.parentName)}<small>${ae(x.mobile)}</small></td><td><span class="status">${ae(x.status)}</span></td><td><button class="btn small" onclick="location.href='admission-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No admission applications found.</td></tr>';
}
function saveAdmission(e){
 e.preventDefault();const f=e.target,a=ax(),id=f.id.value||"ADM-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,applicationNo:f.applicationNo.value.trim(),applicationDate:f.applicationDate.value,academicYear:f.academicYear.value.trim(),studentName:f.studentName.value.trim(),gender:f.gender.value,dob:f.dob.value,classApplied:f.classApplied.value.trim(),parentName:f.parentName.value.trim(),mobile:f.mobile.value.trim(),email:f.email.value.trim(),previousSchool:f.previousSchool.value.trim(),address:f.address.value.trim(),status:f.status.value,remarks:f.remarks.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);aw(a);location.href="admissions.html";
}
function loadAdmissionForm(){
 const id=new URLSearchParams(location.search).get("id"),x=ax().find(x=>x.id===id);if(!x)return;
 ["id","applicationNo","applicationDate","academicYear","studentName","gender","dob","classApplied","parentName","mobile","email","previousSchool","address","status","remarks"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Admission Application";
}
function admissionProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=ax().find(x=>x.id===id),b=document.getElementById("admissionProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">AD</div><div><h2>${ae(x.studentName)}</h2><p class="muted">${ae(x.applicationNo)} · ${ae(x.status)}</p></div></div><div class="detailgrid"><div><small>Academic Year</small><b>${ae(x.academicYear)}</b></div><div><small>Application Date</small><b>${ae(x.applicationDate||"—")}</b></div><div><small>Date of Birth</small><b>${ae(x.dob||"—")}</b></div><div><small>Gender</small><b>${ae(x.gender)}</b></div><div><small>Class Applied</small><b>${ae(x.classApplied)}</b></div><div><small>Parent / Guardian</small><b>${ae(x.parentName)}</b></div><div><small>Mobile</small><b>${ae(x.mobile)}</b></div><div><small>Email</small><b>${ae(x.email||"—")}</b></div><div class="wide"><small>Previous School</small><b>${ae(x.previousSchool||"—")}</b></div><div class="wide"><small>Address</small><b>${ae(x.address||"—")}</b></div><div class="wide"><small>Remarks</small><b>${ae(x.remarks||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-admission.html?id=${encodeURIComponent(x.id)}'">Edit Application</button></div>`;
}
