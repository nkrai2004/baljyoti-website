const CK="aarikaAcademics";
function cx(){try{return JSON.parse(localStorage.getItem(CK)||"null")||[]}catch(e){return[]}}
function cw(v){localStorage.setItem(CK,JSON.stringify(v))}
function ce(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderSubjects(){
 const a=cx(),q=(document.getElementById("subjectSearch")?.value||"").toLowerCase(),r=document.getElementById("subjectRows");
 const f=a.filter(x=>(x.code+" "+x.name+" "+x.type+" "+x.className+" "+x.teacher).toLowerCase().includes(q));
 document.getElementById("subjectCount").textContent=a.length;
 document.getElementById("coreCount").textContent=a.filter(x=>x.type==="CORE").length;
 document.getElementById("electiveCount").textContent=a.filter(x=>x.type==="ELECTIVE").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${ce(x.code)}</b></td><td><b>${ce(x.name)}</b><small>${ce(x.type)}</small></td><td>${ce(x.className)}${x.section?" - "+ce(x.section):""}</td><td>${ce(x.teacher||"—")}</td><td>${ce(x.periods||"—")}</td><td><button class="btn small" onclick="location.href='subject-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No subjects found.</td></tr>';
}
function saveSubject(e){
 e.preventDefault();const f=e.target,a=cx(),id=f.id.value||"SUB-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,code:f.code.value.trim(),name:f.name.value.trim(),type:f.type.value,className:f.className.value.trim(),section:f.section.value.trim(),teacher:f.teacher.value.trim(),periods:f.periods.value,description:f.description.value.trim(),academicYear:f.academicYear.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);cw(a);location.href="academics.html";
}
function loadSubjectForm(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id);if(!x)return;
 ["id","code","name","type","className","section","teacher","periods","description","academicYear"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Subject";
}
function subjectProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id),b=document.getElementById("subjectProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">▤</div><div><h2>${ce(x.name)}</h2><p class="muted">${ce(x.code)} · ${ce(x.type)}</p></div></div><div class="detailgrid"><div><small>Academic Year</small><b>${ce(x.academicYear)}</b></div><div><small>Type</small><b>${ce(x.type)}</b></div><div><small>Class / Section</small><b>${ce(x.className)}${x.section?" - "+ce(x.section):""}</b></div><div><small>Teacher</small><b>${ce(x.teacher||"—")}</b></div><div><small>Periods / Week</small><b>${ce(x.periods||"—")}</b></div><div class="wide"><small>Description</small><b>${ce(x.description||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-subject.html?id=${encodeURIComponent(x.id)}'">Edit Subject</button></div>`;
}
