import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlFp1mxhtzaCy16eXFKX9glqWDAiyS_hg",
  authDomain: "jcs-tab-tracker.firebaseapp.com",
  projectId: "jcs-tab-tracker",
  storageBucket: "jcs-tab-tracker.appspot.com",
  messagingSenderId: "557593235569",
  appId: "1:557593235569:web:f48c54248eae89d86f4bd0",
  measurementId: "G-KXRF1B2ZEJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
