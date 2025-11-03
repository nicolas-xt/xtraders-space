import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Log configuration for debugging
console.log("🔧 Initializing Firebase with:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✓ Present" : "✗ Missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "✗ Missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✓ Present" : "✗ Missing",
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error("❌ Firebase configuration is incomplete! Check your environment variables.");
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
