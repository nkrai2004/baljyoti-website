const TK="aarikaTimetable";
function tx(d=[]){try{return JSON.parse(localStorage.getItem(TK)||"null")??d}catch(e){return d}}
function tw(v){localStorage.setItem(TK,JSON.stringify(v))}
function escT(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderTimetable(){
 const a=tx(),q=(document.getElementById("ttSearch")?.value||"").toLowerCase(),r=document.getElementById("ttRows");if(!r)return;
 const f=a.filter(x=>(x.day+" "+x.className+" "+x.section+" "+x.subject+" "+x.teacher+" "+x.room).toLowerCase().includes(q));
 document.getElementById("ttCount").textContent=a.length;
 document.getElementById("classCount").textContent=new Set(a.map(x=>x.className+"-"+x.section)).size;
 document.getElementById("teacherCount").textContent=new Set(a.map(x=>x.teacher).filter(Boolean)).size;
 r.innerHTML=f.map(x=>`<tr><td><b>${escT(x.day)}</b><small>${escT(x.period)}</small></td><td>${escT(x.className)} - ${escT(x.section)}</td><td>${escT(x.subject)}</td><td>${escT(x.teacher)}</td><td>${escT(x.room||"—")}</td><td>${escT(x.start)} - ${escT(x.end)}</td><td><button class="btn small" onclick="location.href='timetable-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No timetable entries found.</td></tr>';
}
function saveTT(e){
 e.preventDefault();const f=e.target,a=tx(),id=f.id.value||"TT-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,day:f.day.value,period:f.period.value,className:f.className.value.trim(),section:f.section.value.trim(),subject:f.subject.value.trim(),teacher:f.teacher.value.trim(),room:f.room.value.trim(),start:f.start.value,end:f.end.value,academicYear:f.academicYear.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);tw(a);location.href="timetable.html";
}
function loadTTForm(){
 const id=new URLSearchParams(location.search).get("id"),x=tx().find(x=>x.id===id);if(!x)return;
 ["id","day","period","className","section","subject","teacher","room","start","end","academicYear"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Timetable Entry";
}
function ttProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=tx().find(x=>x.id===id),b=document.getElementById("ttProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">◫</div><div><h2>${escT(x.subject)}</h2><p class="muted">${escT(x.className)} - ${escT(x.section)} · ${escT(x.day)}</p></div></div>
 <div class="detailgrid"><div><small>Period</small><b>${escT(x.period)}</b></div><div><small>Time</small><b>${escT(x.start)} - ${escT(x.end)}</b></div><div><small>Subject</small><b>${escT(x.subject)}</b></div><div><small>Teacher</small><b>${escT(x.teacher||"—")}</b></div><div><small>Room</small><b>${escT(x.room||"—")}</b></div><div><small>Academic Year</small><b>${escT(x.academicYear)}</b></div></div>
 <div class="formactions"><button class="btn" onclick="location.href='add-timetable.html?id=${encodeURIComponent(x.id)}'">Edit Entry</button></div>`;
}
