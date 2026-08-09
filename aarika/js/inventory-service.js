const IK="aarikaInventoryItems",STK="aarikaInventoryTransactions";
function ix(k,d=[]){try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch(e){return d}}
function iw(k,v){localStorage.setItem(k,JSON.stringify(v))}
function escI(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function items(){return ix(IK)} function trans(){return ix(STK)}
function initInventory(){if(!localStorage.getItem(IK))iw(IK,[]);if(!localStorage.getItem(STK))iw(STK,[])}
function renderInventory(){
 const a=items(),t=trans(),low=a.filter(x=>x.stock<=x.minStock).length,total=a.reduce((n,x)=>n+Number(x.stock||0),0);
 document.getElementById("invItems").textContent=a.length;document.getElementById("invStock").textContent=total;document.getElementById("invLow").textContent=low;document.getElementById("invMoves").textContent=t.length;
 const r=document.getElementById("inventoryRows");if(!r)return;
 r.innerHTML=a.map(x=>`<tr><td><b>${escI(x.name)}</b><small>${escI(x.code)}</small></td><td>${escI(x.category)}</td><td>${escI(x.unit)}</td><td>${x.stock}</td><td>${x.minStock}</td><td><span class="status">${x.stock<=x.minStock?"LOW":"OK"}</span></td></tr>`).join("")||'<tr><td colspan="6" class="muted">No inventory items yet.</td></tr>';
}
function addItem(e){e.preventDefault();const f=e.target,a=items();a.push({id:"INV-"+Date.now(),code:f.code.value.trim()||"ITEM-"+Date.now().toString().slice(-6),name:f.name.value.trim(),category:f.category.value.trim(),unit:f.unit.value,stock:Number(f.stock.value||0),minStock:Number(f.minStock.value||0)});iw(IK,a);location.href="inventory.html"}
function prepareMovement(){
 const s=document.getElementById("invItem");if(s)s.innerHTML='<option value="">Select item</option>'+items().map(x=>`<option value="${x.id}">${escI(x.name)} — ${x.stock} ${escI(x.unit)}</option>`).join("");
}
function stockMovement(e){
 e.preventDefault();const f=e.target,x=items().find(v=>v.id===f.itemId.value),qty=Number(f.qty.value);if(!x||qty<=0){alert("Select item and valid quantity.");return}
 if(f.type.value==="OUT"&&qty>x.stock){alert("Insufficient stock.");return}
 x.stock += f.type.value==="IN"?qty:-qty;
 const a=trans();a.push({id:"MOV-"+Date.now(),itemId:x.id,itemName:x.name,type:f.type.value,qty,party:f.party.value.trim(),date:new Date().toISOString().slice(0,10),remarks:f.remarks.value.trim()});iw(IK,items());iw(STK,a);location.href="inventory-transactions.html";
}
function renderMovements(){
 const r=document.getElementById("movementRows");if(!r)return;
 r.innerHTML=trans().slice().reverse().map(x=>`<tr><td><b>${escI(x.itemName)}</b></td><td><span class="status">${x.type}</span></td><td>${x.qty}</td><td>${escI(x.party||"—")}</td><td>${escI(x.date)}</td><td>${escI(x.remarks||"—")}</td></tr>`).join("")||'<tr><td colspan="6" class="muted">No stock movements yet.</td></tr>';
}
initInventory();
