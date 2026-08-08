const AD_KEY="aarikaAdmissions";
function getAdmissions(){try{return JSON.parse(localStorage.getItem(AD_KEY)||"[]")}catch(e){return []}}
function saveAdmissions(x){localStorage.setItem(AD_KEY,JSON.stringify(x))}
function getAdClasses(){try{return JSON.parse(localStorage.getItem("aarikaClasses")||"[]")}catch(e){return []}}
function escA(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderAdmissions(){
 const a=getAdmissions(),root=document.getElementById("admissionRows");if(!root)return;
 const counts={ENQUIRY:0,APPLIED:0,SHORTLISTED:0,ADMITTED:0,REJECTED:0};
 a.forEach(x=>counts[x.status]=(counts[x.status]||0)+1);
 Object.keys(counts).forEach(k=>{const el=document.getElementById("ad_"+k);if(el)el.textContent=counts[k]});
 root.innerHTML=a.slice().reverse().map(x=>`<tr><td><b>${escA(x.name)}</b><small>${escA(x.applicationNo)}</small></td><td>${escA(x.classApplied)}</td><td>${escA(x.parentName)}<small>${escA(x.mobile)}</small></td><td><span class="status">${escA(x.status)}</span></td><td>${escA(x.source||"Website")}</td><td><button class="linkbtn" onclick="location.href='admission-profile.html?id=${encodeURIComponent(x.id)}'">Open</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No admission enquiries yet.</td></tr>';
}
function createAdmission(e){
 e.preventDefault();const f=e.target;
 const x={id:"AD-"+Date.now(),applicationNo:"APP-"+Date.now().toString().slice(-7),name:f.name.value.trim(),dob:f.dob.value,classApplied:f.classApplied.value,parentName:f.parentName.value.trim(),mobile:f.mobile.value.trim(),email:f.email.value.trim(),source:f.source.value,status:"ENQUIRY",created:new Date().toISOString().slice(0,10),documents:[]};
 if(!x.name||!x.classApplied||!x.parentName||!x.mobile){alert("Complete all required fields.");return}
 const a=getAdmissions();a.push(x);saveAdmissions(a);location.href="admission-profile.html?id="+encodeURIComponent(x.id);
}
function renderAdmissionProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=getAdmissions().find(a=>a.id===id),root=document.getElementById("adProfile");
 if(!x){root.innerHTML='<div class="card"><h2>Application not found</h2></div>';return}
 document.getElementById("adTitle").textContent=x.name;
 document.getElementById("adMeta").textContent=`${x.applicationNo} • Class ${x.classApplied} • ${x.status}`;
 root.innerHTML=`<div class="metric-grid"><div class="metric"><div class="caption">APPLICATION</div><div class="num" style="font-size:17px">${escA(x.applicationNo)}</div></div><div class="metric"><div class="caption">STATUS</div><div class="num" style="font-size:17px">${escA(x.status)}</div></div><div class="metric"><div class="caption">SOURCE</div><div class="num" style="font-size:17px">${escA(x.source)}</div></div></div>
 <div class="card"><h2>Applicant Details</h2><div class="detailgrid"><div><small>Parent / Guardian</small><b>${escA(x.parentName)}</b></div><div><small>Mobile</small><b>${escA(x.mobile)}</b></div><div><small>Email</small><b>${escA(x.email||"—")}</b></div><div><small>Date of Birth</small><b>${escA(x.dob||"—")}</b></div></div></div>
 <div class="card section"><h2>Admission Stage</h2><div class="stagebar">${["ENQUIRY","APPLIED","SHORTLISTED","ADMITTED"].map(s=>`<button class="stage ${x.status===s?"current":""}" onclick="updateAdmissionStatus('${x.id}','${s}')">${s}</button>`).join("")}</div></div>
 <div class="card section"><h2>Document Checklist</h2><div class="checkgrid">${["Birth Certificate","Previous School Report","Transfer Certificate","Address Proof","Parent ID Proof","Photograph"].map(d=>`<label class="checkcard"><input type="checkbox" onchange="toggleDoc('${x.id}',${JSON.stringify(d)},this.checked)" ${x.documents.includes(d)?"checked":""}><span>${d}</span></label>`).join("")}</div></div>
 <div class="dangerline"><button class="btn secondary" onclick="deleteAdmission('${x.id}')">Delete Application</button></div>`;
}
function updateAdmissionStatus(id,status){const a=getAdmissions(),x=a.find(v=>v.id===id);if(!x)return;x.status=status;saveAdmissions(a);renderAdmissionProfile()}
function toggleDoc(id,doc,checked){const a=getAdmissions(),x=a.find(v=>v.id===id);if(!x)return;x.documents=checked?[...new Set([...x.documents,doc])]:x.documents.filter(d=>d!==doc);saveAdmissions(a)}
function deleteAdmission(id){if(!confirm("Delete this application?"))return;saveAdmissions(getAdmissions().filter(x=>x.id!==id));location.href="admissions.html"}
