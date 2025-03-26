// Import required functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt3VU-7coY_fk2vHMl_nH69SWYiHcC4IQ",
  authDomain: "facetrack-bba6d.firebaseapp.com",
  projectId: "facetrack-bba6d",
  storageBucket: "facetrack-bba6d.appspot.com", // Fix: `firebasestorage.app` should be `appspot.com`
  messagingSenderId: "12308103921",
  appId: "1:12308103921:web:fd9e25ef44016c71a91f50",
  measurementId: "G-6TF8LJ49D8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Authentication
const googleProvider = new GoogleAuthProvider(); // Initialize Google Auth Provider

export { auth, googleProvider, analytics };
