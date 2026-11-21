import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const enabled=Boolean(config.apiKey&&config.projectId&&config.appId);
let auth,db,user=null;
if(enabled){const app=initializeApp(config);auth=getAuth(app);db=getFirestore(app);signInAnonymously(auth).catch(console.error);onAuthStateChanged(auth,u=>{user=u;});}
export function watchLeaderboard(onData,onError=console.error){
 if(!enabled)return ()=>{};
 return onSnapshot(query(collection(db,'scores'),orderBy('score','desc'),limit(10)),snap=>onData(snap.docs.map(d=>({id:d.id,...d.data()}))),onError);
}
export async function submitScore(data){
 if(!enabled||!user)return {online:false};
 await addDoc(collection(db,'scores'),{uid:user.uid,displayName:data.displayName||'Meadow Bee',score:data.score,level:data.level,world:data.world,createdAt:serverTimestamp()});
 return {online:true};
}
export function isOnlineConfigured(){return enabled;}
