const SUBJECT_KEY="aarikaSubjects";
const MAP_KEY="aarikaSubjectMap";
const DEMO_SUBJECTS=[
 {id:"SUB-001",code:"MAT",name:"Mathematics",type:"Core",status:"ACTIVE"},
 {id:"SUB-002",code:"SCI",name:"Science",type:"Core",status:"ACTIVE"},
 {id:"SUB-003",code:"ENG",name:"English",type:"Core",status:"ACTIVE"},
 {id:"SUB-004",code:"HIN",name:"Hindi",type:"Language",status:"ACTIVE"},
 {id:"SUB-005",code:"SST",name:"Social Science",type:"Core",status:"ACTIVE"},
 {id:"SUB-006",code:"CS",name:"Computer Science",type:"Elective",status:"ACTIVE"}
];
function academicSeed(){
 if(!localStorage.getItem(SUBJECT_KEY))localStorage.setItem(SUBJECT_KEY,JSON.stringify(DEMO_SUBJECTS));
 if(!localStorage.getItem(MAP_KEY))localStorage.setItem(MAP_KEY,JSON.stringify({}));
}
function getSubjects(){try{return JSON.parse(localStorage.getItem(SUBJECT_KEY)||"[]")}catch(e){return []}}
function saveSubjects(x){localStorage.setItem(SUBJECT_KEY,JSON.stringify(x))}
function getSubjectMap(){try{return JSON.parse(localStorage.getItem(MAP_KEY)||"{}")}catch(e){return {}}}
function saveSubjectMap(x){localStorage.setItem(MAP_KEY,JSON.stringify(x))}
function getAcademicClasses(){try{return JSON.parse(localStorage.getItem("aarikaClasses")||"[]")}catch(e){return []}}
function getAcademicTeachers(){try{return JSON.parse(localStorage.getItem("aarikaTeachers")||"[]")}catch(e){return []}}
function escAcademic(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function nextSubjectId(){return "SUB-"+Date.now().toString().slice(-8)}
function openAddSubject(){location.href="add-subject.html"}
function renderSubjectTable(filter=""){
 const tbody=document.getElementById("subjectRows");if(!tbody)return;
 const q=filter.trim().toLowerCase(),all=getSubjects();
 const data=all.filter(s=>!q||[s.code,s.name,s.type].join(" ").toLowerCase().includes(q));
 tbody.innerHTML=data.map(s=>`<tr><td><b>${escAcademic(s.name)}</b><small>${escAcademic(s.code)}</small></td><td>${escAcademic(s.type)}</td><td>${Object.values(getSubjectMap()).filter(a=>(a||[]).includes(s.id)).length}</td><td><span class="status">${escAcademic(s.status)}</span></td><td><button class="linkbtn" onclick="viewSubject('${s.id}')">Manage</button></td></tr>`).join("")||'<tr><td colspan="5" class="muted">No subjects found.</td></tr>';
 document.getElementById("subjectCount").textContent=all.length;
}
function viewSubject(id){location.href="subject-profile.html?id="+encodeURIComponent(id)}
function createSubject(e){
 e.preventDefault();const f=e.target;
 const s={id:nextSubjectId(),code:f.code.value.trim().toUpperCase(),name:f.name.value.trim(),type:f.type.value,status:"ACTIVE"};
 if(!s.code||!s.name){alert("Subject code and name are required.");return}
 if(getSubjects().some(x=>x.code===s.code)){alert("Subject code already exists.");return}
 const all=getSubjects();all.push(s);saveSubjects(all);location.href="subject-profile.html?id="+encodeURIComponent(s.id);
}
function populateAcademicClassSelect(){
 const sel=document.getElementById("academicClass");if(!sel)return;
 sel.innerHTML='<option value="">Select class / section</option>'+getAcademicClasses().map(c=>`<option value="${c.id}">Class ${c.name}-${c.section}</option>`).join("");
}
function renderAcademicMapping(){
 const classId=document.getElementById("academicClass").value,root=document.getElementById("academicRows");
 if(!root)return;
 if(!classId){root.innerHTML='<tr><td colspan="4" class="muted">Select a class/section to manage its subjects.</td></tr>';return}
 const map=getSubjectMap(),assigned=map[classId]||[],teachers=getAcademicTeachers(),subjects=getSubjects();
 root.innerHTML=subjects.map(s=>{
   const checked=assigned.includes(s.id);
   const teacher=teachers.find(t=>t.subjects?.includes(s.name));
   return `<tr><td><b>${escAcademic(s.name)}</b><small>${escAcademic(s.code)}</small></td><td>${escAcademic(s.type)}</td><td>${teacher?escAcademic(teacher.name):"—"}</td><td><label class="switchrow"><input type="checkbox" ${checked?"checked":""} onchange="toggleSubject('${classId}','${s.id}',this.checked)"><span>${checked?"Assigned":"Not assigned"}</span></label></td></tr>`;
 }).join("");
 document.getElementById("assignedCount").textContent=assigned.length;
}
function toggleSubject(classId,subjectId,on){
 const map=getSubjectMap();map[classId]=map[classId]||[];
 if(on&&!map[classId].includes(subjectId))map[classId].push(subjectId);
 if(!on)map[classId]=map[classId].filter(x=>x!==subjectId);
 saveSubjectMap(map);renderAcademicMapping();
}
function renderSubjectProfile(){
 const id=new URLSearchParams(location.search).get("id"),s=getSubjects().find(x=>x.id===id),root=document.getElementById("subjectProfile");
 if(!s){root.innerHTML='<div class="card"><h2>Subject not found</h2></div>';return}
 document.getElementById("profileName").textContent=s.name;
 document.getElementById("profileMeta").textContent=`${s.code} • ${s.type}`;
 const map=getSubjectMap(),classes=getAcademicClasses().filter(c=>(map[c.id]||[]).includes(s.id));
 const teachers=getAcademicTeachers().filter(t=>(t.subjects||[]).includes(s.name));
 root.innerHTML=`<div class="profile-grid"><div class="card"><div class="label">Code</div><strong>${escAcademic(s.code)}</strong></div><div class="card"><div class="label">Type</div><strong>${escAcademic(s.type)}</strong></div><div class="card"><div class="label">Classes</div><strong>${classes.length}</strong></div><div class="card"><div class="label">Teachers</div><strong>${teachers.length}</strong></div></div>
 <div class="card section"><h2>Assigned Classes</h2>${classes.length?`<div class="linked-students">${classes.map(c=>`<button class="module-card" onclick="location.href='class-profile.html?id=${encodeURIComponent(c.id)}'"><div class="module-icon">▦</div><b>Class ${c.name}-${c.section}</b><p>Open class profile</p></button>`).join("")}`:'<p class="muted">Not assigned to any class.</p>'}</div>
 <div class="card section"><h2>Teachers for this Subject</h2>${teachers.length?teachers.map(t=>`<button class="module-card" onclick="location.href='teacher-profile.html?id=${encodeURIComponent(t.id)}'"><div class="module-icon">♟</div><b>${escAcademic(t.name)}</b><p>${escAcademic(t.designation)}</p></button>`).join(""):'<p class="muted">No teacher mapped.</p>'}</div>`;
}
academicSeed();
