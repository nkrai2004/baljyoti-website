function rx(k,d=[]){try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch(e){return d}}
function reportStudents(){return rx("aarikaStudents")}
function reportData(){
 const students=reportStudents(), books=rx("aarikaBooks"), lib=rx("aarikaLibraryTransactions"), inv=rx("aarikaInventoryItems"), invTx=rx("aarikaInventoryTransactions"), admissions=rx("aarikaAdmissions"), messages=rx("aarikaMessages"), routes=rx("aarikaTransportRoutes"), ta=rx("aarikaTransportAssignments"), vehicles=rx("aarikaVehicles");
 return {students,books,lib,inv,invTx,admissions,messages,routes,ta,vehicles}
}
function escR(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderReports(){
 const d=reportData(), activeAdmissions=d.admissions.filter(x=>!["REJECTED","CLOSED"].includes(x.status)).length, issued=d.lib.filter(x=>x.status==="ISSUED").length, overdue=d.lib.filter(x=>x.status==="ISSUED"&&x.dueDate<new Date().toISOString().slice(0,10)).length, low=d.inv.filter(x=>x.stock<=x.minStock).length;
 const vals={rStudents:d.students.length,rAdmissions:d.admissions.length,rActive:activeAdmissions,rBooks:d.books.length,rIssued:issued,rOverdue:overdue,rInventory:d.inv.length,rLow:low,rRoutes:d.routes.length,rAssigned:d.ta.length,rMessages:d.messages.length};
 Object.entries(vals).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.textContent=v});
 const rows=document.getElementById("reportRows"); if(!rows)return;
 const data=[
 ["Student Strength","Students",d.students.length,"Student master"],
 ["Admissions","Applications",d.admissions.length,"Admissions module"],
 ["Active Admissions","Applications",activeAdmissions,"Admissions not closed/rejected"],
 ["Library Circulation","Books Issued",issued,"Current issues"],
 ["Library Overdue","Books",overdue,"Due date passed"],
 ["Inventory","Items",d.inv.length,"Inventory master"],
 ["Low Stock","Items",low,"At/below minimum stock"],
 ["Transport","Routes",d.routes.length,"Transport master"],
 ["Transport","Students Assigned",d.ta.length,"Student assignments"],
 ["Communication","Messages",d.messages.length,"Communication history"]
 ];
 rows.innerHTML=data.map(x=>`<tr><td><b>${escR(x[0])}</b></td><td>${escR(x[1])}</td><td><strong>${x[2]}</strong></td><td>${escR(x[3])}</td></tr>`).join("");
}
function exportReport(){
 const d=reportData(),rows=[["Report","Metric","Value"],["Students","Student Strength",d.students.length],["Admissions","Applications",d.admissions.length],["Library","Books Issued",d.lib.filter(x=>x.status==="ISSUED").length],["Library","Overdue",d.lib.filter(x=>x.status==="ISSUED"&&x.dueDate<new Date().toISOString().slice(0,10)).length],["Inventory","Items",d.inv.length],["Inventory","Low Stock",d.inv.filter(x=>x.stock<=x.minStock).length],["Transport","Routes",d.routes.length],["Transport","Students Assigned",d.ta.length],["Communication","Messages",d.messages.length]];
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n"),blob=new Blob([csv],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aarika-school-report.csv";a.click();URL.revokeObjectURL(a.href);
}
function reportFilter(){
 const q=(document.getElementById("reportSearch")?.value||"").toLowerCase();
 document.querySelectorAll("#reportRows tr").forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?"":"none");
}
