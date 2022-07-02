import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyDhX5eDsEEpRbZXZ72kPNw6xaA09XkaMZ4",
  authDomain: "jcs-tab-tracking.firebaseapp.com",
  projectId: "jcs-tab-tracking",
  storageBucket: "jcs-tab-tracking.appspot.com",
  messagingSenderId: "906180988740",
  appId: "1:906180988740:web:988062a6c76cef2c1fd111",
  measurementId: "G-GHCSVHRGHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5"),
  isTokenAutoRefreshEnabled: true,
});

export { auth, db, appCheck };
