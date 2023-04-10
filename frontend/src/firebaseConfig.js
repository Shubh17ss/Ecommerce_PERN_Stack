import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBbtP5mvluQTj49cYJ4Wt9foRikq-4_Bgw",
    authDomain: "social-c12f6.firebaseapp.com",
    projectId: "social-c12f6",
    storageBucket: "social-c12f6.appspot.com",
    messagingSenderId: "145981855314",
    appId: "1:145981855314:web:b097040de4d4d62cb9f18b"
  };

  export const app=initializeApp(firebaseConfig);
  export const db=getFirestore(app);
  export const storage=getStorage(app);
  export const auth=getAuth(app);