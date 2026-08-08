const EK="aarikaExams";
function ex(){try{return JSON.parse(localStorage.getItem(EK)||"null")||[]}catch(e){return[]}}
function ew(v){localStorage.setItem(EK,JSON.stringify(v))}
function ee(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderExams(){
 const a=ex(),q=(document.getElementById("examSearch")?.value||"").toLowerCase(),r=document.getElementById("examRows");
 const f=a.filter(x=>(x.examName+" "+x.subject+" "+x.className+" "+x.type+" "+x.status).toLowerCase().includes(q));
 document.getElementById("examCount").textContent=a.length;
 document.getElementById("scheduledCount").textContent=a.filter(x=>x.status==="SCHEDULED").length;
 document.getElementById("publishedCount").textContent=a.filter(x=>x.status==="PUBLISHED").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${ee(x.examName)}</b><small>${ee(x.type)}</small></td><td>${ee(x.subject)}</td><td>${ee(x.className)}${x.section?" - "+ee(x.section):""}</td><td>${ee(x.examDate)}<small>${ee(x.startTime||"")}</small></td><td>${ee(x.maxMarks)}</td><td><span class="status">${ee(x.status)}</span></td><td><button class="btn small" onclick="location.href='exam-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No examinations found.</td></tr>';
}
function saveExam(e){
 e.preventDefault();const f=e.target,a=ex(),id=f.id.value||"EXM-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,examName:f.examName.value.trim(),type:f.type.value,academicYear:f.academicYear.value.trim(),subject:f.subject.value.trim(),className:f.className.value.trim(),section:f.section.value.trim(),examDate:f.examDate.value,startTime:f.startTime.value,endTime:f.endTime.value,maxMarks:f.maxMarks.value,passingMarks:f.passingMarks.value,status:f.status.value,room:f.room.value.trim(),instructions:f.instructions.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);ew(a);location.href="exams.html";
}
function loadExamForm(){
 const id=new URLSearchParams(location.search).get("id"),x=ex().find(x=>x.id===id);if(!x)return;
 ["id","examName","type","academicYear","subject","className","section","examDate","startTime","endTime","maxMarks","passingMarks","status","room","instructions"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Examination";
}
function examProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=ex().find(x=>x.id===id),b=document.getElementById("examProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">EX</div><div><h2>${ee(x.examName)}</h2><p class="muted">${ee(x.subject)} · ${ee(x.status)}</p></div></div><div class="detailgrid"><div><small>Academic Year</small><b>${ee(x.academicYear)}</b></div><div><small>Type</small><b>${ee(x.type)}</b></div><div><small>Class / Section</small><b>${ee(x.className)}${x.section?" - "+ee(x.section):""}</b></div><div><small>Date</small><b>${ee(x.examDate)}</b></div><div><small>Time</small><b>${ee(x.startTime||"—")} - ${ee(x.endTime||"—")}</b></div><div><small>Room</small><b>${ee(x.room||"—")}</b></div><div><small>Maximum Marks</small><b>${ee(x.maxMarks)}</b></div><div><small>Passing Marks</small><b>${ee(x.passingMarks)}</b></div><div class="wide"><small>Instructions</small><b>${ee(x.instructions||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-exam.html?id=${encodeURIComponent(x.id)}'">Edit Examination</button></div>`;
}
