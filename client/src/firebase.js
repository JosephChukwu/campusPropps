// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-campusprops.firebaseapp.com",
  projectId: "real-campusprops",
  storageBucket: "real-campusprops.appspot.com",
  messagingSenderId: "209659166488",
  appId: "1:209659166488:web:4fc3f7dffbbdc13afee86d"
};

// Initializ
 export const app = initializeApp(firebaseConfig);