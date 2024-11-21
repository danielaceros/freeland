import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDvKSawbS__98AXl9udbALhjOSr7Pap60E',
  authDomain: 'freeland-477fb.firebaseapp.com',
  projectId: 'freeland-477fb',
  storageBucket: 'freeland-477fb.appspot.com',
  messagingSenderId: '185009045277',
  appId: '1:185009045277:web:54a614ed400f88de3d2bf4',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

