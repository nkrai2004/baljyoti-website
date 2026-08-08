const CK="aarikaCommunication";
function cx(){try{return JSON.parse(localStorage.getItem(CK)||"null")||[]}catch(e){return[]}}
function cw(v){localStorage.setItem(CK,JSON.stringify(v))}
function ce(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderCommunication(){
 const a=cx(),q=(document.getElementById("commSearch")?.value||"").toLowerCase(),r=document.getElementById("commRows");
 const f=a.filter(x=>(x.title+" "+x.channel+" "+x.audience+" "+x.status).toLowerCase().includes(q));
 document.getElementById("messageCount").textContent=a.length;
 document.getElementById("sentCount").textContent=a.filter(x=>x.status==="SENT").length;
 document.getElementById("draftCount").textContent=a.filter(x=>x.status==="DRAFT").length;
 document.getElementById("scheduledCount").textContent=a.filter(x=>x.status==="SCHEDULED").length;
 r.innerHTML=f.map(x=>`<tr><td><b>${ce(x.title)}</b><small>${ce(x.message).slice(0,70)}</small></td><td>${ce(x.channel)}</td><td>${ce(x.audience)}</td><td>${ce(x.schedule||"—")}</td><td><span class="status">${ce(x.status)}</span></td><td><button class="btn small" onclick="location.href='communication-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No communication records found.</td></tr>';
}
function saveCommunication(e){
 e.preventDefault();const f=e.target,a=cx(),id=f.id.value||"MSG-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,title:f.title.value.trim(),channel:f.channel.value,audience:f.audience.value.trim(),schedule:f.schedule.value,message:f.message.value.trim(),status:f.status.value,priority:f.priority.value,createdAt:f.createdAt.value,remarks:f.remarks.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);cw(a);location.href="communication.html";
}
function loadCommunicationForm(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id);if(!x)return;
 ["id","title","channel","audience","schedule","message","status","priority","createdAt","remarks"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Communication";
}
function communicationProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=cx().find(x=>x.id===id),b=document.getElementById("commProfileBody");if(!b||!x)return;
 b.innerHTML=`<div class="profilehero"><div class="avatar large">✉</div><div><h2>${ce(x.title)}</h2><p class="muted">${ce(x.channel)} · ${ce(x.status)}</p></div></div><div class="detailgrid"><div><small>Audience</small><b>${ce(x.audience)}</b></div><div><small>Priority</small><b>${ce(x.priority)}</b></div><div><small>Schedule</small><b>${ce(x.schedule||"—")}</b></div><div><small>Created</small><b>${ce(x.createdAt||"—")}</b></div><div class="wide"><small>Message</small><b>${ce(x.message)}</b></div><div class="wide"><small>Remarks</small><b>${ce(x.remarks||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-communication.html?id=${encodeURIComponent(x.id)}'">Edit Communication</button></div>`;
}
