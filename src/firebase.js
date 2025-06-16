// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
 apiKey: "AIzaSyClffvlLY66cKD6ex6eOygg8uS9rbKvCns",
  authDomain: "liar-1-ebc12.firebaseapp.com",
  projectId: "liar-1-ebc12",
  storageBucket: "liar-1-ebc12.firebasestorage.app",
  messagingSenderId: "853929867266",
  appId: "1:853929867266:web:12fd05aa5cfdc0746d0f1b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
