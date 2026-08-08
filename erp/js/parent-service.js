const PK="aarikaParents";
function px(d=[]){try{return JSON.parse(localStorage.getItem(PK)||"null")??d}catch(e){return d}}
function pw(v){localStorage.setItem(PK,JSON.stringify(v))}
function escP(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderParents(){
 const a=px(),q=(document.getElementById("parentSearch")?.value||"").toLowerCase(),r=document.getElementById("parentRows");if(!r)return;
 const f=a.filter(x=>(x.parentName+" "+x.relation+" "+x.phone+" "+x.email+" "+x.studentNames+" "+x.studentAdmissions).toLowerCase().includes(q));
 document.getElementById("parentCount").textContent=a.length;
 document.getElementById("primaryCount").textContent=a.filter(x=>x.isPrimary==="YES").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${escP(x.parentName)}</b><small>${escP(x.relation)}</small></td><td>${escP(x.phone)}</td><td>${escP(x.email||"—")}</td><td>${escP(x.studentNames||"—")}<small>${escP(x.studentAdmissions||"")}</small></td><td>${escP(x.isPrimary)}</td><td><button class="btn small" onclick="location.href='parent-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No parents / guardians found.</td></tr>';
}
function saveParent(e){
 e.preventDefault();const f=e.target,a=px(),id=f.id.value||"PAR-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,parentName:f.parentName.value.trim(),relation:f.relation.value,phone:f.phone.value.trim(),alternatePhone:f.alternatePhone.value.trim(),email:f.email.value.trim(),occupation:f.occupation.value.trim(),isPrimary:f.isPrimary.value,address:f.address.value.trim(),studentNames:f.studentNames.value.trim(),studentAdmissions:f.studentAdmissions.value.trim(),notes:f.notes.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);pw(a);location.href="parents.html";
}
function loadParentForm(){
 const id=new URLSearchParams(location.search).get("id"),x=px().find(x=>x.id===id);if(!x)return;
 ["id","parentName","relation","phone","alternatePhone","email","occupation","isPrimary","address","studentNames","studentAdmissions","notes"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Parent / Guardian";
}
function parentProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=px().find(x=>x.id===id),b=document.getElementById("parentProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">PG</div><div><h2>${escP(x.parentName)}</h2><p class="muted">${escP(x.relation)} · ${escP(x.phone)}</p></div></div>
 <div class="detailgrid"><div><small>Relationship</small><b>${escP(x.relation)}</b></div><div><small>Primary Contact</small><b>${escP(x.isPrimary)}</b></div><div><small>Phone</small><b>${escP(x.phone)}</b></div><div><small>Alternate Phone</small><b>${escP(x.alternatePhone||"—")}</b></div><div><small>Email</small><b>${escP(x.email||"—")}</b></div><div><small>Occupation</small><b>${escP(x.occupation||"—")}</b></div><div><small>Student(s)</small><b>${escP(x.studentNames||"—")}</b></div><div><small>Admission No.</small><b>${escP(x.studentAdmissions||"—")}</b></div><div class="wide"><small>Address</small><b>${escP(x.address||"—")}</b></div><div class="wide"><small>Notes</small><b>${escP(x.notes||"—")}</b></div></div>
 <div class="formactions"><button class="btn" onclick="location.href='add-parent.html?id=${encodeURIComponent(x.id)}'">Edit Parent</button></div>`;
}
