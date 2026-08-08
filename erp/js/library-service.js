const BK="aarikaBooks",TR="aarikaLibraryTransactions";
function lx(k,d=[]){try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch(e){return d}}
function sx(k,v){localStorage.setItem(k,JSON.stringify(v))}
function escL(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function books(){return lx(BK)} function txns(){return lx(TR)} function sts(){return lx("aarikaStudents")}
function initLib(){if(!localStorage.getItem(BK))sx(BK,[]);if(!localStorage.getItem(TR))sx(TR,[])}
function renderLibrary(){
 const b=books(),t=txns(),issued=t.filter(x=>x.status==="ISSUED").length,over=t.filter(x=>x.status==="ISSUED"&&x.dueDate<new Date().toISOString().slice(0,10)).length;
 document.getElementById("bookCount").textContent=b.length;document.getElementById("issuedCount").textContent=issued;document.getElementById("overCount").textContent=over;
 const r=document.getElementById("bookRows");if(!r)return;
 r.innerHTML=b.map(x=>`<tr><td><b>${escL(x.title)}</b><small>${escL(x.author)}</small></td><td>${escL(x.isbn||"—")}</td><td>${escL(x.category||"—")}</td><td>${x.copies}</td><td>${x.available}</td><td><span class="status">${x.status}</span></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No books added yet.</td></tr>';
}
function addBook(e){e.preventDefault();const f=e.target,c=Number(f.copies.value||1);const b=books();b.push({id:"BK-"+Date.now(),title:f.title.value.trim(),author:f.author.value.trim(),isbn:f.isbn.value.trim(),category:f.category.value.trim(),copies:c,available:c,status:"ACTIVE"});sx(BK,b);location.href="library.html"}
function prepareIssue(){
 document.getElementById("libBook").innerHTML='<option value="">Select book</option>'+books().filter(b=>b.available>0).map(b=>`<option value="${b.id}">${escL(b.title)} — ${b.available} available</option>`).join("");
 document.getElementById("libStudent").innerHTML='<option value="">Select student</option>'+sts().map(s=>`<option value="${s.id}">${escL(s.firstName+" "+s.lastName)} — ${escL(s.admissionNo||"")}</option>`).join("");
}
function issueBook(e){e.preventDefault();const f=e.target,b=books().find(x=>x.id===f.bookId.value),s=sts().find(x=>x.id===f.studentId.value);if(!b||!s||b.available<1){alert("Select an available book and student.");return}const due=f.dueDate.value||new Date(Date.now()+14*86400000).toISOString().slice(0,10);const a=txns();a.push({id:"LIB-"+Date.now(),bookId:b.id,bookTitle:b.title,studentId:s.id,studentName:s.firstName+" "+s.lastName,issueDate:new Date().toISOString().slice(0,10),dueDate:due,returnDate:"",status:"ISSUED"});b.available--;sx(BK,books());sx(TR,a);location.href="library-transactions.html"}
function renderTransactions(){
 const r=document.getElementById("libTxnRows");if(!r)return;
 r.innerHTML=txns().slice().reverse().map(x=>`<tr><td><b>${escL(x.bookTitle)}</b></td><td>${escL(x.studentName)}</td><td>${escL(x.issueDate)}</td><td>${escL(x.dueDate)}</td><td><span class="status">${x.status}</span></td><td>${x.status==="ISSUED"?`<button class="linkbtn" onclick="returnBook('${x.id}')">Return</button>`:"—"}</td></tr>`).join("")||'<tr><td colspan="6" class="muted">No library transactions yet.</td></tr>';
}
function returnBook(id){const a=txns(),x=a.find(v=>v.id===id);if(!x||x.status!=="ISSUED")return;x.status="RETURNED";x.returnDate=new Date().toISOString().slice(0,10);const b=books().find(v=>v.id===x.bookId);if(b)b.available=Math.min(b.copies,b.available+1);sx(TR,a);sx(BK,books());renderTransactions()}
initLib();
