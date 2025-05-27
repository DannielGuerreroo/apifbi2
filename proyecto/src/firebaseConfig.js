import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLniPZM-qYqCY0guDPV8CKu7gr20Pbm-o",
  authDomain: "apifbi-44287.firebaseapp.com",
  projectId: "apifbi-44287",
  storageBucket: "apifbi-44287.firebasestorage.app",
  messagingSenderId: "411499221410",
  appId: "1:411499221410:web:7409162e79f3bbf4c322fb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ ¡Esto es necesario!

export { auth, db };