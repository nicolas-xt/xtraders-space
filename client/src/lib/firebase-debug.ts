
import { auth } from "./firebase";

export function debugFirebaseConfig() {
  console.group("🔍 Firebase Configuration Debug");
  console.log("API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
  console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log("App ID exists:", !!import.meta.env.VITE_FIREBASE_APP_ID);
  console.log("Auth Domain:", auth.config.authDomain);
  console.log("Current Domain:", window.location.hostname);
  console.log("Current URL:", window.location.href);
  console.log("Current Auth State:", auth.currentUser ? "Logged In" : "Logged Out");
  
  // Check if this might be a redirect callback
  const urlParams = new URLSearchParams(window.location.search);
  const hasAuthParams = urlParams.has('code') || urlParams.has('state');
  if (hasAuthParams) {
    console.warn("⚠️ Auth parameters detected in URL - this looks like a redirect callback");
  }
  
  console.groupEnd();
}
