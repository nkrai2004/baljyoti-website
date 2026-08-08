import {
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { AARIKA_FIREBASE_CONFIG, AARIKA_FIREBASE_ENABLED } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

let db=null;
if(AARIKA_FIREBASE_ENABLED){
  const app=initializeApp(AARIKA_FIREBASE_CONFIG);
  db=getFirestore(app);
}

export async function listUsers(){
  if(!db) return [];
  const snap=await getDocs(query(collection(db,"users"),orderBy("email")));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}

export async function saveUser(user){
  if(!db) throw new Error("Firebase is not configured.");
  const id=user.uid || user.email.toLowerCase().replace(/[^a-z0-9]/g,"_");
  await setDoc(doc(db,"users",id),{
    email:user.email.toLowerCase(),
    name:user.name||"",
    role:user.role||"SCHOOL_ADMIN",
    schoolId:user.schoolId||"",
    status:user.status||"ACTIVE",
    updatedAt:new Date().toISOString()
  },{merge:true});
}

export async function removeUser(id){
  if(!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db,"users",id));
}
