const TK="aarikaTransport";
function tx(){try{return JSON.parse(localStorage.getItem(TK)||"null")||[]}catch(e){return[]}}
function tw(v){localStorage.setItem(TK,JSON.stringify(v))}
function te(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderTransport(){
 const a=tx(),q=(document.getElementById("transportSearch")?.value||"").toLowerCase(),r=document.getElementById("transportRows");
 const f=a.filter(x=>(x.routeName+" "+x.routeCode+" "+x.vehicleNo+" "+x.driver+" "+x.stop).toLowerCase().includes(q));
 document.getElementById("routeCount").textContent=a.length;
 document.getElementById("activeCount").textContent=a.filter(x=>x.status==="ACTIVE").length;
 document.getElementById("vehicleCount").textContent=[...new Set(a.map(x=>x.vehicleNo).filter(Boolean))].length;
 r.innerHTML=f.map(x=>`<tr><td><b>${te(x.routeName)}</b><small>${te(x.routeCode)}</small></td><td>${te(x.vehicleNo||"—")}</td><td>${te(x.driver||"—")}<small>${te(x.driverPhone||"")}</small></td><td>${te(x.stop||"—")}</td><td>${te(x.pickupTime||"—")}</td><td><span class="status">${te(x.status)}</span></td><td><button class="btn small" onclick="location.href='transport-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="7" class="muted">No transport routes found.</td></tr>';
}
function saveTransport(e){
 e.preventDefault();const f=e.target,a=tx(),id=f.id.value||"TRN-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,routeName:f.routeName.value.trim(),routeCode:f.routeCode.value.trim(),vehicleNo:f.vehicleNo.value.trim(),vehicleType:f.vehicleType.value,driver:f.driver.value.trim(),driverPhone:f.driverPhone.value.trim(),attendant:f.attendant.value.trim(),stop:f.stop.value.trim(),pickupTime:f.pickupTime.value,dropTime:f.dropTime.value,status:f.status.value,capacity:f.capacity.value,notes:f.notes.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);tw(a);location.href="transport.html";
}
function loadTransportForm(){
 const id=new URLSearchParams(location.search).get("id"),x=tx().find(x=>x.id===id);if(!x)return;
 ["id","routeName","routeCode","vehicleNo","vehicleType","driver","driverPhone","attendant","stop","pickupTime","dropTime","status","capacity","notes"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Transport Route";
}
function transportProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=tx().find(x=>x.id===id),b=document.getElementById("transportProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">BUS</div><div><h2>${te(x.routeName)}</h2><p class="muted">${te(x.routeCode)} · ${te(x.status)}</p></div></div><div class="detailgrid"><div><small>Vehicle</small><b>${te(x.vehicleNo||"—")}</b></div><div><small>Vehicle Type</small><b>${te(x.vehicleType)}</b></div><div><small>Driver</small><b>${te(x.driver||"—")}</b></div><div><small>Driver Phone</small><b>${te(x.driverPhone||"—")}</b></div><div><small>Attendant</small><b>${te(x.attendant||"—")}</b></div><div><small>Capacity</small><b>${te(x.capacity||"—")}</b></div><div><small>Stop</small><b>${te(x.stop||"—")}</b></div><div><small>Pickup / Drop</small><b>${te(x.pickupTime||"—")} / ${te(x.dropTime||"—")}</b></div><div class="wide"><small>Notes</small><b>${te(x.notes||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-transport.html?id=${encodeURIComponent(x.id)}'">Edit Route</button></div>`;
}
