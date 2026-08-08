const CK="aarikaClasses";
function cx(d=[]){try{return JSON.parse(localStorage.getItem(CK)||"null")??d}catch(e){return d}}
function cw(v){localStorage.setItem(CK,JSON.stringify(v))}
function escC(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderClasses(){
 const a=cx(),q=(document.getElementById("classSearch")?.value||"").toLowerCase(),r=document.getElementById("classRows");if(!r)return;
 const f=a.filter(x=>(x.className+" "+x.section+" "+x.classTeacher+" "+x.academicYear).toLowerCase().includes(q));
 document.getElementById("classCount").textContent=a.length;
 document.getElementById("sectionCount").textContent=new Set(a.map(x=>x.className+"|"+x.section)).size;
 r.innerHTML=f.map(x=>`<tr><td><b>${escC(x.className)}</b></td><td>${escC(x.section)}</td><td>${escC(x.academicYear)}</td><td>${escC(x.classTeacher||"—")}</td><td>${x.capacity}</td><td><span class="status">${escC(x.status)}</span></td><td><button class="btn small" onclick="location.href='class-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No classes or sections found.</td></tr>';
}
function saveClass(e){
 e.preventDefault();const f=e.target,a=cx(),id=f.id.value||"CLS-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,className:f.className.value.trim(),section:f.section.value.trim(),academicYear:f.academicYear.value.trim(),classTeacher:f.classTeacher.value.trim(),capacity:Number(f.capacity.value||40),status:f.status.value};
 if(old)Object.assign(old,rec);else a.push(rec);cw(a);location.href="classes.html";
}
function loadClassForm(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id);if(!x)return;
 ["id","className","section","academicYear","classTeacher","capacity","status"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Class / Section";
}
function classProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id),b=document.getElementById("classProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">▦</div><div><h2>${escC(x.className)} - Section ${escC(x.section)}</h2><p class="muted">${escC(x.academicYear)}</p></div></div>
 <div class="detailgrid"><div><small>Class Teacher</small><b>${escC(x.classTeacher||"—")}</b></div><div><small>Capacity</small><b>${x.capacity}</b></div><div><small>Status</small><b>${escC(x.status)}</b></div><div><small>Academic Year</small><b>${escC(x.academicYear)}</b></div></div>
 <div class="formactions"><button class="btn" onclick="location.href='add-class.html?id=${encodeURIComponent(x.id)}'">Edit Class</button></div>`;
}
