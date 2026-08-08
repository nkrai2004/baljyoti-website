import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { AARIKA_FIREBASE_CONFIG, AARIKA_FIREBASE_ENABLED } from "./firebase-config.js";

let app=null, auth=null, db=null;

if(AARIKA_FIREBASE_ENABLED){
  app=initializeApp(AARIKA_FIREBASE_CONFIG);
  auth=getAuth(app);
  db=getFirestore(app);
}

export function firebaseEnabled(){ return AARIKA_FIREBASE_ENABLED; }

export async function loginWithGoogle(){
  if(!AARIKA_FIREBASE_ENABLED) throw new Error("Firebase is not configured yet.");
  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({hd:"baljyoti.com"});
  return signInWithPopup(auth,provider);
}

export async function logoutFirebase(){
  if(auth) await signOut(auth);
}

export function watchAuth(callback){
  if(!auth){ callback(null); return ()=>{}; }
  return onAuthStateChanged(auth,callback);
}

export async function listSchools(){
  if(!db) return [];
  const q=query(collection(db,"schools"),orderBy("createdAt","desc"));
  const snap=await getDocs(q);
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}

export async function createSchool(data){
  if(!db) throw new Error("Firebase is not configured.");
  const payload={...data,createdAt:new Date().toISOString(),status:data.status||"ACTIVE"};
  const ref=await addDoc(collection(db,"schools"),payload);
  return {id:ref.id,...payload};
}

export async function getSchool(id){
  if(!db) return null;
  const snap=await getDoc(doc(db,"schools",id));
  return snap.exists()?{id:snap.id,...snap.data()}:null;
}

export async function updateSchool(id,data){
  if(!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db,"schools",id),data);
}
