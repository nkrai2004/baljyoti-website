"use strict";
(function(){
const CFG=window.BJ_FIREBASE_CONFIG||null;
const $=id=>document.getElementById(id);
const labels={super_admin:"Super Admin",director:"Director",principal:"Principal",administrator:"Administrator",academic_coordinator:"Academic Coordinator",admission_coordinator:"Admission Coordinator",activity_coordinator:"Activity Coordinator",sports_discipline_coordinator:"Sports & Discipline Coordinator",teacher:"Teacher",accountant:"Accountant",hr_manager:"HR Manager",staff:"Staff",student:"Student",parent:"Parent"};
let auth,db;
function showMessage(t,kind){const el=$("authMessage");el.textContent=t;el.className="message "+(kind||"error");el.hidden=false}
function roleKey(v){return String(v||"").trim().toLowerCase().replace(/[ -]+/g,"_")}
async function checkUser(user){
 const email=String(user.email||"").trim().toLowerCase();
 if(!user.emailVerified)throw Error("Please use a verified Google account.");
 const snap=await db.collection("users").doc(user.uid).get();
 if(!snap.exists)throw Error("Your school profile has not been created. Please contact the school administrator.");
 const p=snap.data()||{},role=roleKey(p.role);
 if(String(p.email||"").trim().toLowerCase()!==email)throw Error("Your Google email does not match your school profile.");
 if(p.status!=="active")throw Error("Your school account is not active. Please contact the school administrator.");
 if(!labels[role])throw Error("Your assigned role is not recognised.");
 const type=p.accountType||(["student","parent"].includes(role)?role:"staff");
 if(type==="staff"&&!email.endsWith("@baljyoti.com"))throw Error("Staff must sign in using their official @baljyoti.com account.");
 const s=db.collection("system"),docs=await Promise.all([s.doc("roleRegistry").get(),s.doc("moduleRegistry").get(),s.doc("roleModuleAccess").get()]);
 if(docs.some(d=>!d.exists))throw Error("Role and module settings are incomplete. Ask the Super Admin to configure access.");
 const roles=docs[0].data().roles||{},modules=docs[1].data().modules||[],access=docs[2].data().access||{};
 if(!Object.prototype.hasOwnProperty.call(roles,role))throw Error("Your role is not configured.");
 const grants=role==="super_admin"?["*"]:(Array.isArray(access[role])?access[role]:[]);
 const allowed=modules.filter(m=>m&&m.active!==false&&(grants.includes("*")||grants.includes(m.id)));
 $("loginView").hidden=true;$("appView").hidden=false;
 $("personName").textContent=p.fullName||user.displayName||email;$("email").textContent=email;$("personRole").textContent=labels[role];
 $("welcomeTitle").textContent="Welcome, "+(p.fullName||user.displayName||"User");
 const list=$("moduleList");list.replaceChildren();
 allowed.forEach(m=>{const card=document.createElement("div");card.className="module";const b=document.createElement("b");b.textContent=m.label||m.id;const d=document.createElement("small");d.textContent=m.description||"Authorised module";card.append(b,d);list.append(card)});
 if(role==="super_admin"||grants.includes("*")||grants.includes("user_management")){const a=document.createElement("a");a.className="module admin";a.href="user-management/index.html";a.innerHTML="<b>User Management</b><small>Manage school profiles and roles</small>";list.prepend(a)}
 if(role==="parent")$("parentNote").hidden=false;
 if(role==="student")$("studentNote").hidden=false;
}
async function authState(user){if(!user){$("loginView").hidden=false;$("appView").hidden=true;return}try{await checkUser(user)}catch(e){await auth.signOut();$("loginView").hidden=false;$("appView").hidden=true;showMessage(e.message)}}
document.addEventListener("DOMContentLoaded",()=>{
 if(!CFG||!CFG.apiKey||CFG.projectId==="REPLACE_WITH_STAGING_PROJECT"){showMessage("Staging Firebase is not configured. This development build is intentionally disconnected from the live school database.");$("googleBtn").disabled=true;return;}
 firebase.initializeApp(CFG);auth=firebase.auth();db=firebase.firestore();
 $("googleBtn").onclick=async()=>{try{const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:"select_account"});await auth.signInWithPopup(p)}catch(e){showMessage(e.message)}};
 $("signOut").onclick=()=>auth.signOut();auth.onAuthStateChanged(authState);
});
})();