const TK="aarikaStaff";
function tx(d=[]){try{return JSON.parse(localStorage.getItem(TK)||"null")??d}catch(e){return d}}
function tw(v){localStorage.setItem(TK,JSON.stringify(v))}
function escF(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function staffName(s){return `${s.firstName||""} ${s.lastName||""}`.trim()}
function renderStaff(){
 const a=tx(),q=(document.getElementById("staffSearch")?.value||"").toLowerCase(),r=document.getElementById("staffRows");if(!r)return;
 const f=a.filter(s=>(staffName(s)+" "+(s.employeeNo||"")+" "+(s.department||"")+" "+(s.designation||"")).toLowerCase().includes(q));
 document.getElementById("staffCount").textContent=a.length;
 document.getElementById("activeCount").textContent=a.filter(s=>(s.status||"ACTIVE")==="ACTIVE").length;
 r.innerHTML=f.map(s=>`<tr><td><b>${escF(staffName(s))}</b><small>${escF(s.employeeNo)}</small></td><td>${escF(s.department)}</td><td>${escF(s.designation)}</td><td>${escF(s.phone)}</td><td><span class="status">${escF(s.status||"ACTIVE")}</span></td><td><button class="btn small" onclick="location.href='staff-profile.html?id=${encodeURIComponent(s.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No staff found.</td></tr>';
}
function saveStaff(e){
 e.preventDefault();const f=e.target,a=tx(),id=f.id.value||"EMP-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,employeeNo:f.employeeNo.value.trim(),firstName:f.firstName.value.trim(),lastName:f.lastName.value.trim(),department:f.department.value.trim(),designation:f.designation.value.trim(),joiningDate:f.joiningDate.value,phone:f.phone.value.trim(),email:f.email.value.trim(),address:f.address.value.trim(),status:f.status.value};
 if(old)Object.assign(old,rec);else a.push(rec);tw(a);location.href="staff.html";
}
function loadStaffForm(){
 const id=new URLSearchParams(location.search).get("id"),s=tx().find(x=>x.id===id);if(!s)return;
 ["id","employeeNo","firstName","lastName","department","designation","joiningDate","phone","email","address","status"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=s[k]??""});
 document.getElementById("formTitle").textContent="Edit Staff";
}
function staffProfile(){
 const id=new URLSearchParams(location.search).get("id"),s=tx().find(x=>x.id===id),b=document.getElementById("staffProfileBody");if(!b||!s)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">${escF((s.firstName||"S").slice(0,1)+(s.lastName||"").slice(0,1))}</div><div><h2>${escF(staffName(s))}</h2><p class="muted">${escF(s.employeeNo)} · ${escF(s.designation)}</p></div></div>
 <div class="detailgrid"><div><small>Department</small><b>${escF(s.department)}</b></div><div><small>Designation</small><b>${escF(s.designation)}</b></div><div><small>Joining Date</small><b>${escF(s.joiningDate||"—")}</b></div><div><small>Phone</small><b>${escF(s.phone)}</b></div><div><small>Email</small><b>${escF(s.email)}</b></div><div><small>Status</small><b>${escF(s.status)}</b></div><div class="wide"><small>Address</small><b>${escF(s.address||"—")}</b></div></div>`;
}
