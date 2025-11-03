
import { auth } from "./firebase";

export function debugFirebaseConfig() {
  console.group("🔍 Firebase Configuration Debug");
  console.log("API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
  console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log("App ID exists:", !!import.meta.env.VITE_FIREBASE_APP_ID);
  console.log("Auth Domain:", auth.config.authDomain);
  console.log("Current Auth State:", auth.currentUser ? "Logged In" : "Logged Out");
  console.groupEnd();
}
