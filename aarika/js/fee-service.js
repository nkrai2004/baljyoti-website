const FK="aarikaFees";
function fx(){try{return JSON.parse(localStorage.getItem(FK)||"null")||[]}catch(e){return[]}}
function fw(v){localStorage.setItem(FK,JSON.stringify(v))}
function fe(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderFees(){
 const a=fx(),q=(document.getElementById("feeSearch")?.value||"").toLowerCase(),r=document.getElementById("feeRows");
 const f=a.filter(x=>(x.studentName+" "+x.admissionNo+" "+x.feeHead+" "+x.term+" "+x.status).toLowerCase().includes(q));
 const billed=a.reduce((s,x)=>s+Number(x.amount||0),0),paid=a.reduce((s,x)=>s+Number(x.paid||0),0),due=billed-paid;
 document.getElementById("feeCount").textContent=a.length;
 document.getElementById("billedCount").textContent="₹"+billed.toLocaleString("en-IN");
 document.getElementById("paidCount").textContent="₹"+paid.toLocaleString("en-IN");
 document.getElementById("dueCount").textContent="₹"+due.toLocaleString("en-IN");
 r.innerHTML=f.map(x=>{const due=Math.max(0,Number(x.amount||0)-Number(x.paid||0));return `<tr><td><b>${fe(x.admissionNo)}</b></td><td><b>${fe(x.studentName)}</b><small>${fe(x.className||"")}</small></td><td>${fe(x.feeHead)}</td><td>${fe(x.term)}</td><td>₹${Number(x.amount||0).toLocaleString("en-IN")}</td><td>₹${Number(x.paid||0).toLocaleString("en-IN")}</td><td>₹${due.toLocaleString("en-IN")}</td><td><span class="status">${fe(x.status)}</span></td><td><button class="btn small" onclick="location.href='fee-profile.html?id=${encodeURIComponent(x.id)}'">View</button></td></tr>`}).join("")||'<tr><td colspan="9" class="muted">No fee records found.</td></tr>';
}
function saveFee(e){
 e.preventDefault();const f=e.target,a=fx(),id=f.id.value||"FEE-"+Date.now(),old=a.find(x=>x.id===id);
 const rec={id,admissionNo:f.admissionNo.value.trim(),studentName:f.studentName.value.trim(),className:f.className.value.trim(),feeHead:f.feeHead.value.trim(),term:f.term.value,academicYear:f.academicYear.value.trim(),amount:f.amount.value,paid:f.paid.value,dueDate:f.dueDate.value,status:f.status.value,paymentMode:f.paymentMode.value,paymentDate:f.paymentDate.value,receiptNo:f.receiptNo.value.trim(),remarks:f.remarks.value.trim()};
 if(old)Object.assign(old,rec);else a.push(rec);fw(a);location.href="fees.html";
}
function loadFeeForm(){
 const id=new URLSearchParams(location.search).get("id"),x=fx().find(x=>x.id===id);if(!x)return;
 ["id","admissionNo","studentName","className","feeHead","term","academicYear","amount","paid","dueDate","status","paymentMode","paymentDate","receiptNo","remarks"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=x[k]??""});
 document.getElementById("formTitle").textContent="Edit Fee Record";
}
function feeProfile(){
 const id=new URLSearchParams(location.search).get("id"),x=fx().find(x=>x.id===id),b=document.getElementById("feeProfileBody");if(!b||!x)return;
 const due=Math.max(0,Number(x.amount||0)-Number(x.paid||0));
 b.innerHTML=`<div class="profilehero"><div class="avatar large">₹</div><div><h2>${fe(x.studentName)}</h2><p class="muted">${fe(x.admissionNo)} · ${fe(x.feeHead)}</p></div></div><div class="detailgrid"><div><small>Academic Year</small><b>${fe(x.academicYear)}</b></div><div><small>Term</small><b>${fe(x.term)}</b></div><div><small>Class</small><b>${fe(x.className||"—")}</b></div><div><small>Fee Head</small><b>${fe(x.feeHead)}</b></div><div><small>Amount</small><b>₹${Number(x.amount||0).toLocaleString("en-IN")}</b></div><div><small>Paid</small><b>₹${Number(x.paid||0).toLocaleString("en-IN")}</b></div><div><small>Due</small><b>₹${due.toLocaleString("en-IN")}</b></div><div><small>Status</small><b>${fe(x.status)}</b></div><div><small>Due Date</small><b>${fe(x.dueDate||"—")}</b></div><div><small>Payment Mode</small><b>${fe(x.paymentMode||"—")}</b></div><div><small>Receipt No.</small><b>${fe(x.receiptNo||"—")}</b></div><div><small>Payment Date</small><b>${fe(x.paymentDate||"—")}</b></div><div class="wide"><small>Remarks</small><b>${fe(x.remarks||"—")}</b></div></div><div class="formactions"><button class="btn" onclick="location.href='add-fee.html?id=${encodeURIComponent(x.id)}'">Edit Fee Record</button></div>`;
}
