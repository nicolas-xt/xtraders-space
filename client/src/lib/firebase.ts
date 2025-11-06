import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
// Prefer initializing Firestore with experimentalForceLongPolling when available
let _db: any;
try {
  const forceLongPollingEnv = import.meta.env.VITE_FIRESTORE_FORCE_LONG_POLLING;
  const enableLongPolling =
    forceLongPollingEnv === undefined ? true : String(forceLongPollingEnv).toLowerCase() === "true";

  if (enableLongPolling && typeof initializeFirestore === "function") {
    // initializeFirestore accepts settings; use it to enable long polling when possible
    _db = initializeFirestore(app, { experimentalForceLongPolling: true });
    console.info("Firestore: initialized with experimentalForceLongPolling via initializeFirestore()");
  } else {
    _db = getFirestore(app);
  }
} catch (err) {
  // Fallback to getFirestore and try to set settings on the instance
  console.warn("Firestore: could not initialize with long polling, falling back to getFirestore", err);
  _db = getFirestore(app);
  try {
    // attempt to set settings on the instance (some SDK versions expose settings())
    ( _db as any ).settings?.({ experimentalForceLongPolling: true });
    console.info("Firestore: experimentalForceLongPolling enabled via settings() fallback");
  } catch (e) {
    console.warn("Firestore: unable to enable experimentalForceLongPolling on fallback", e);
  }
}

export const db = _db;
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

// 🔐 Adicionar permissões do Google Drive
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');

// Firestore: algumas redes/proxies causam falhas no transporte gRPC/WebChannel.
// Como mitigação, ativamos experimentalForceLongPolling onde suportado —
// isso usa long-polling em vez de streams WebChannel e reduz mensagens
// "WebChannelConnection ... transport errored" em muitos ambientes.
try {
  // Type assertion porque `settings` não está tipado fortemente em algumas versões
  // do SDK modular. Se não for suportado, isso não quebra a inicialização.
  const forceLongPollingEnv = import.meta.env.VITE_FIRESTORE_FORCE_LONG_POLLING;
  const enableLongPolling =
    forceLongPollingEnv === undefined ? true : String(forceLongPollingEnv).toLowerCase() === "true";

  if (enableLongPolling) {
    (db as any).settings?.({ experimentalForceLongPolling: true });
    console.info("Firestore: experimentalForceLongPolling enabled to improve transport stability.");
  } else {
    console.info("Firestore: experimentalForceLongPolling disabled via VITE_FIRESTORE_FORCE_LONG_POLLING=false");
  }
} catch (err) {
  console.warn("Firestore: could not enable experimentalForceLongPolling", err);
}