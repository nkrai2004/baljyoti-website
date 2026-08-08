const TENANT_KEY="aarikaTenants";
function getTenants(){
  try{return JSON.parse(localStorage.getItem(TENANT_KEY)||"[]")}catch(e){return []}
}
function saveTenants(x){localStorage.setItem(TENANT_KEY,JSON.stringify(x))}
function seedTenant(){
  let x=getTenants();
  if(!x.length){
    x=[{id:"BJPS-001",name:"Bal Jyoti Public School",code:"BJPS",city:"Noida",status:"ACTIVE",adminName:"School Admin",adminEmail:"admin@baljyoti.com",createdAt:new Date().toISOString()}];
    saveTenants(x)
  }
}
seedTenant();

function tenantById(id){return getTenants().find(x=>x.id===id)}
function newId(){return "SCH-"+Date.now().toString().slice(-8)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderTenants(){
  const box=document.getElementById("tenantRows"); if(!box)return;
  const data=getTenants();
  box.innerHTML=data.map(t=>`<tr>
    <td><b>${esc(t.name)}</b><small>${esc(t.code)}</small></td>
    <td>${esc(t.city)}</td><td><span class="status">${esc(t.status)}</span></td>
    <td>${esc(t.adminEmail||"—")}</td>
    <td><button class="linkbtn" onclick="openTenant('${t.id}')">View</button></td>
  </tr>`).join("");
  const c=document.getElementById("schoolCount"); if(c)c.textContent=data.length;
}

function openTenant(id){location.href="school-details.html?id="+encodeURIComponent(id)}
function openCreate(){location.href="add-school.html"}

function createSchool(e){
  e.preventDefault();
  const f=e.target;
  const t={
    id:newId(),
    name:f.name.value.trim(),
    code:f.code.value.trim().toUpperCase(),
    city:f.city.value.trim(),
    status:"ACTIVE",
    adminName:f.adminName.value.trim(),
    adminEmail:f.adminEmail.value.trim().toLowerCase(),
    createdAt:new Date().toISOString()
  };
  if(!t.name||!t.code||!t.adminEmail){alert("Please complete the required fields.");return}
  const all=getTenants();
  if(all.some(x=>x.code===t.code)){alert("School code already exists.");return}
  all.push(t);saveTenants(all);
  location.href="school-details.html?id="+encodeURIComponent(t.id)+"&created=1";
}

function renderDetails(){
  const id=new URLSearchParams(location.search).get("id");
  const t=tenantById(id);
  if(!t){document.getElementById("details").innerHTML="<div class='card'><h2>School not found</h2></div>";return}
  document.getElementById("schoolName").textContent=t.name;
  document.getElementById("schoolMeta").textContent=`${t.code} • ${t.city} • ${t.status}`;
  document.getElementById("details").innerHTML=`
    <div class="grid2">
      <div class="card"><div class="label">School Code</div><strong>${esc(t.code)}</strong></div>
      <div class="card"><div class="label">Status</div><strong>${esc(t.status)}</strong></div>
      <div class="card"><div class="label">Location</div><strong>${esc(t.city)}</strong></div>
      <div class="card"><div class="label">Created</div><strong>${new Date(t.createdAt).toLocaleDateString()}</strong></div>
    </div>
    <div class="card section"><h2>School Admin</h2><p><b>${esc(t.adminName)}</b><br>${esc(t.adminEmail)}</p><p class="muted">Demo: this admin can be used for the School Admin role after backend authentication is connected.</p></div>
    <div class="actions"><button class="btn" onclick="enterSchool('${t.id}')">Enter School</button><button class="btn secondary" onclick="location.href='super-schools.html'">Back to Schools</button></div>`;
}
function enterSchool(id){
  const t=tenantById(id); if(!t)return;
  sessionStorage.setItem("selectedSchool",JSON.stringify(t));
  location.href="dashboard.html";
}
