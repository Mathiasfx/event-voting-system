import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9s-tAtUM-Ayhe1lJRfax_jjVXJvqGlXI",
  authDomain: "event-voting-system-789a9.firebaseapp.com",
  projectId: "event-voting-system-789a9",
  storageBucket: "event-voting-system-789a9.firebasestorage.app",
  messagingSenderId: "761250730096",
  appId: "1:761250730096:web:b8031cbe3415aa8980e4b5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
