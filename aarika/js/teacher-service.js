const TEACHER_KEY="aarikaTeachers";
const DEMO_TEACHERS=[
 {id:"TCH-1001",employeeNo:"EMP-001",name:"Priya Sharma",gender:"Female",mobile:"+91 98XXXXXX11",email:"priya.sharma@baljyoti.com",designation:"PGT",subjects:["Mathematics"],classes:["CLS-005"],status:"ACTIVE"},
 {id:"TCH-1002",employeeNo:"EMP-002",name:"Rahul Verma",gender:"Male",mobile:"+91 98XXXXXX12",email:"rahul.verma@baljyoti.com",designation:"TGT",subjects:["Science"],classes:["CLS-003"],status:"ACTIVE"},
 {id:"TCH-1003",employeeNo:"EMP-003",name:"Neha Kapoor",gender:"Female",mobile:"+91 98XXXXXX13",email:"neha.kapoor@baljyoti.com",designation:"TGT",subjects:["English"],classes:["CLS-004"],status:"ACTIVE"}
];
function teacherSeed(){if(!localStorage.getItem(TEACHER_KEY))localStorage.setItem(TEACHER_KEY,JSON.stringify(DEMO_TEACHERS))}
function getTeachers(){try{return JSON.parse(localStorage.getItem(TEACHER_KEY)||"[]")}catch(e){return []}}
function saveTeachers(x){localStorage.setItem(TEACHER_KEY,JSON.stringify(x))}
function escTeacher(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function getClassesStore(){try{return JSON.parse(localStorage.getItem("aarikaClasses")||"[]")}catch(e){return []}}
function nextTeacherId(){return "TCH-"+Date.now().toString().slice(-8)}
function getTeacher(id){return getTeachers().find(t=>t.id===id)}
function classLabel(id){const c=getClassesStore().find(x=>x.id===id);return c?`Class ${c.name}-${c.section}`:id}
function viewTeacher(id){location.href="teacher-profile.html?id="+encodeURIComponent(id)}
function openAddTeacher(){location.href="add-teacher.html"}
function renderTeacherTable(filter=""){
 const tbody=document.getElementById("teacherRows");if(!tbody)return;
 const q=filter.trim().toLowerCase(),all=getTeachers();
 const data=all.filter(t=>!q||[t.employeeNo,t.name,t.mobile,t.email,t.designation,...t.subjects].join(" ").toLowerCase().includes(q));
 tbody.innerHTML=data.map(t=>`<tr><td><b>${escTeacher(t.name)}</b><small>${escTeacher(t.employeeNo)}</small></td>
 <td>${escTeacher(t.designation)}</td><td>${t.subjects.map(escTeacher).join(", ")||"—"}</td><td>${escTeacher(t.mobile)}<small>${escTeacher(t.email)}</small></td>
 <td>${t.classes.map(classLabel).map(escTeacher).join(", ")||"—"}</td><td><span class="status">${escTeacher(t.status)}</span></td>
 <td><button class="linkbtn" onclick="viewTeacher('${t.id}')">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No teachers found.</td></tr>';
 document.getElementById("teacherCount").textContent=all.length;
 document.getElementById("activeTeacherCount").textContent=all.filter(t=>t.status==="ACTIVE").length;
}
function createTeacher(e){
 e.preventDefault();const f=e.target;
 const subjects=[...f.querySelectorAll('[name="subjects"]:checked')].map(x=>x.value);
 const classes=[...f.querySelectorAll('[name="classes"]:checked')].map(x=>x.value);
 const t={id:nextTeacherId(),employeeNo:f.employeeNo.value.trim(),name:f.name.value.trim(),gender:f.gender.value,
 mobile:f.mobile.value.trim(),email:f.email.value.trim(),designation:f.designation.value,subjects,classes,status:"ACTIVE",createdAt:new Date().toISOString()};
 if(!t.employeeNo||!t.name||!t.mobile){alert("Employee number, name and mobile are required.");return}
 if(getTeachers().some(x=>x.employeeNo.toLowerCase()===t.employeeNo.toLowerCase())){alert("Employee number already exists.");return}
 const all=getTeachers();all.push(t);saveTeachers(all);location.href="teacher-profile.html?id="+encodeURIComponent(t.id)+"&created=1";
}
function renderTeacherProfile(){
 const id=new URLSearchParams(location.search).get("id"),t=getTeacher(id),root=document.getElementById("teacherProfile");
 if(!t){root.innerHTML='<div class="card"><h2>Teacher not found</h2><button class="btn" onclick="location.href=\'teachers.html\'">Back</button></div>';return}
 document.getElementById("profileName").textContent=t.name;
 document.getElementById("profileMeta").textContent=`${t.employeeNo} • ${t.designation}`;
 root.innerHTML=`<div class="profile-grid">
 <div class="card"><div class="label">Designation</div><strong>${escTeacher(t.designation)}</strong></div>
 <div class="card"><div class="label">Mobile</div><strong>${escTeacher(t.mobile)}</strong></div>
 <div class="card"><div class="label">Email</div><strong>${escTeacher(t.email||"—")}</strong></div>
 <div class="card"><div class="label">Gender</div><strong>${escTeacher(t.gender||"—")}</strong></div></div>
 <div class="card section"><h2>Subjects</h2><p>${t.subjects.map(escTeacher).join(" • ")||"No subjects assigned."}</p></div>
 <div class="card section"><h2>Class Allocation</h2><div class="linked-students">${t.classes.length?t.classes.map(id=>`<button class="module-card" onclick="location.href='class-profile.html?id=${encodeURIComponent(id)}'"><div class="module-icon">▦</div><b>${escTeacher(classLabel(id))}</b><p>Open class profile</p></button>`).join(""):'<p class="muted">No class allocated.</p>'}</div></div>
 <div class="card section"><h2>Teacher Services</h2><div class="quick-grid">
 <button class="module-card" onclick="location.href='attendance.html'"><div class="module-icon">✓</div><b>Attendance</b><p>Take attendance</p></button>
 <button class="module-card" onclick="location.href='timetable.html'"><div class="module-icon">◫</div><b>Timetable</b><p>View timetable</p></button>
 <button class="module-card" onclick="location.href='academics.html'"><div class="module-icon">▤</div><b>Academics</b><p>Subjects & plans</p></button>
 <button class="module-card" onclick="location.href='communication.html'"><div class="module-icon">✉</div><b>Communication</b><p>Staff communication</p></button></div></div>`;
}
teacherSeed();
