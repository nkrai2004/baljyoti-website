const SETK="aarikaSchoolSettings";
function ss(k,d={}){try{return JSON.parse(localStorage.getItem(k)||"null")??d}catch(e){return d}}
function sw(k,v){localStorage.setItem(k,JSON.stringify(v))}
function escS(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function getSettings(){return ss(SETK,{schoolName:"Bal Jyoti Public School",schoolCode:"BJPS",academicYear:"2026-27",address:"",phone:"",email:"info@baljyoti.com",timezone:"Asia/Kolkata",dateFormat:"DD/MM/YYYY",currency:"INR",notifications:true})}
function loadSettings(){
 const s=getSettings();
 ["schoolName","schoolCode","academicYear","address","phone","email","timezone","dateFormat","currency"].forEach(k=>{const e=document.getElementById(k);if(e)e.value=s[k]??""});
 const n=document.getElementById("notifications");if(n)n.checked=s.notifications!==false;
}
function saveSettings(e){
 e.preventDefault();const s=getSettings();
 ["schoolName","schoolCode","academicYear","address","phone","email","timezone","dateFormat","currency"].forEach(k=>s[k]=document.getElementById(k).value.trim());
 s.notifications=document.getElementById("notifications").checked;sw(SETK,s);document.getElementById("saveMsg").textContent="Settings saved successfully.";setTimeout(()=>document.getElementById("saveMsg").textContent="",2500);
}
function loadAcademic(){
 const s=getSettings();document.getElementById("currentYear").textContent=s.academicYear;document.getElementById("currentSchool").textContent=s.schoolName;
}
function resetSettings(){if(confirm("Reset school settings to defaults?")){localStorage.removeItem(SETK);loadSettings();}}
