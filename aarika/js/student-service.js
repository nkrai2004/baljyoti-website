const SK="aarikaStudents";
function sx(d=[]){try{return JSON.parse(localStorage.getItem(SK)||"null")??d}catch(e){return d}}
function sw(v){localStorage.setItem(SK,JSON.stringify(v))}
function escS(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderStudents(){
 const a=sx(),q=(document.getElementById("studentSearch")?.value||"").toLowerCase(),r=document.getElementById("studentRows");if(!r)return;
 const f=a.filter(x=>(x.admissionNo+" "+x.firstName+" "+x.lastName+" "+x.className+" "+x.section+" "+x.parentName+" "+x.phone+" "+x.status).toLowerCase().includes(q));
 document.getElementById("studentCount").textContent=a.length;
 document.getElementById("activeCount").textContent=a.filter(x=>x.status==="ACTIVE").length;
 document.getElementById("inactiveCount").textContent=a.filter(x=>x.status!=="ACTIVE").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${escS(x.admissionNo)}</b></td><td><b>${escS((x.firstName+" "+x.lastName).trim())}</b><small>${escS(x.dob||"")}</small></td><td>${escS(x.className)} - ${escS(x.section||"—")}</td><td>${escS(x.parentName||"—")}<small>${escS(x.phone||"")}</small></td><td><span class="status">${escS(x.status)}</span></td><td><button class="btn small" onclick="location.href='student-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No students found.</td></tr>';
}
function saveStudent(e){
 e.preventDefault();const f=e.target,a=sx(),id=f.id.value||"STU-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,admissionNo:f.admissionNo.value.trim(),firstName:f.firstName.value.trim(),lastName:f.lastName.value.trim(),dob:f.dob.value,className:f.className.value.trim(),section:f.section.value.trim(),parentName:f.parentName.value.trim(),parentRelation:f.parentRelation.value,phone:f.phone.value.trim(),email:f.email.value.trim(),address:f.address.value.trim(),status:f.status.value,gender:f.gender.value,rollNo:f.rollNo.value.trim(),notes:f.notes.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);sw(a);location.href="students.html";
}
function loadStudentForm(){
 const id=new URLSearchParams(location.search).get("id"),x=sx().find(x=>x.id===id);if(!x)return;
 ["id","admissionNo","firstName","lastName","dob","className","section","parentName","parentRelation","phone","email","address","status","gender","rollNo","notes"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Student";
}
function studentProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=sx().find(x=>x.id===id),b=document.getElementById("studentProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">ST</div><div><h2>${escS((x.firstName+" "+x.lastName).trim())}</h2><p class="muted">${escS(x.admissionNo)} · ${escS(x.status)}</p></div></div>
 <div class="detailgrid"><div><small>Class / Section</small><b>${escS(x.className)} - ${escS(x.section||"—")}</b></div><div><small>Roll No.</small><b>${escS(x.rollNo||"—")}</b></div><div><small>Date of Birth</small><b>${escS(x.dob||"—")}</b></div><div><small>Gender</small><b>${escS(x.gender||"—")}</b></div><div><small>Parent / Guardian</small><b>${escS(x.parentName||"—")}</b></div><div><small>Relation</small><b>${escS(x.parentRelation||"—")}</b></div><div><small>Phone</small><b>${escS(x.phone||"—")}</b></div><div><small>Email</small><b>${escS(x.email||"—")}</b></div><div class="wide"><small>Address</small><b>${escS(x.address||"—")}</b></div><div class="wide"><small>Notes</small><b>${escS(x.notes||"—")}</b></div></div>
 <div class="formactions"><button class="btn" onclick="location.href='add-student.html?id=${encodeURIComponent(x.id)}'">Edit Student</button></div>`;
}
