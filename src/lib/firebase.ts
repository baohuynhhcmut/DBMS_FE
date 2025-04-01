import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxe0yDoxW4QcgR6cOlOiKnaxB1tLMdRWo",
  authDomain: "bao-huynhhcmut-project.firebaseapp.com",
  projectId: "bao-huynhhcmut-project",
  storageBucket: "bao-huynhhcmut-project.firebasestorage.app",
  messagingSenderId: "1082005556899",
  appId: "1:1082005556899:web:4baa260bb0b05764ccb916",
  measurementId: "G-V6JKSHDRPW"
};


export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// export const storage = getStorage()