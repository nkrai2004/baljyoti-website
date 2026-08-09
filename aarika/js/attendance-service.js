const AK="aarikaAttendance";
function ax(){try{return JSON.parse(localStorage.getItem(AK)||"null")||[]}catch(e){return[]}}
function aw(v){localStorage.setItem(AK,JSON.stringify(v))}
function ae(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderAttendance(){
 const a=ax(), date=document.getElementById("attendanceDate")?.value||new Date().toISOString().slice(0,10), cls=(document.getElementById("attendanceClass")?.value||"").toLowerCase(), q=(document.getElementById("attendanceSearch")?.value||"").toLowerCase();
 const f=a.filter(x=>x.date===date&&(!cls||x.className.toLowerCase()===cls)&&(!q||(x.studentName+" "+x.admissionNo+" "+x.className+" "+x.section).toLowerCase().includes(q)));
 const all=a.filter(x=>x.date===date), present=all.filter(x=>x.status==="PRESENT").length, absent=all.filter(x=>x.status==="ABSENT").length, late=all.filter(x=>x.status==="LATE").length;
 document.getElementById("presentCount").textContent=present;document.getElementById("absentCount").textContent=absent;document.getElementById("lateCount").textContent=late;document.getElementById("recordCount").textContent=all.length;
 document.getElementById("attendanceRows").innerHTML=f.map(x=>`<tr><td><b>${ae(x.admissionNo)}</b></td><td>${ae(x.studentName)}</td><td>${ae(x.className)} - ${ae(x.section||"—")}</td><td><span class="status">${ae(x.status)}</span></td><td>${ae(x.time||"—")}</td><td>${ae(x.remarks||"—")}</td><td><button class="btn small" onclick="location.href='attendance-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No attendance records for this date.</td></tr>';
}
function saveAttendance(e){
 e.preventDefault();const f=e.target,a=ax(),id=f.id.value||"ATT-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,date:f.date.value,admissionNo:f.admissionNo.value.trim(),studentName:f.studentName.value.trim(),className:f.className.value.trim(),section:f.section.value.trim(),status:f.status.value,time:f.time.value,remarks:f.remarks.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);aw(a);location.href="attendance.html";
}
function loadAttendanceForm(){
 const id=new URLSearchParams(location.search).get("id"),x=ax().find(x=>x.id===id);if(!x)return;
 ["id","date","admissionNo","studentName","className","section","status","time","remarks"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Attendance";
}
function attendanceProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=ax().find(x=>x.id===id),b=document.getElementById("attendanceProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">✓</div><div><h2>${ae(x.studentName)}</h2><p class="muted">${ae(x.admissionNo)} · ${ae(x.status)}</p></div></div><div class="detailgrid"><div><small>Date</small><b>${ae(x.date)}</b></div><div><small>Status</small><b>${ae(x.status)}</b></div><div><small>Class / Section</small><b>${ae(x.className)} - ${ae(x.section||"—")}</b></div><div><small>Time</small><b>${ae(x.time||"—")}</b></div><div class="wide"><small>Remarks</small><b>${ae(x.remarks||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-attendance.html?id=${encodeURIComponent(x.id)}'">Edit Attendance</button></div>`;
}
