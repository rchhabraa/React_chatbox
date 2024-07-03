// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-2e5c9.firebaseapp.com",
  projectId: "reactchat-2e5c9",
  storageBucket: "reactchat-2e5c9.appspot.com",
  messagingSenderId: "766265042677",
  appId: "1:766265042677:web:7da564e1fee9e8c8e6c7bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth =  getAuth(app)
export const db=getFirestore(app)
export const storage=getStorage()