import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
export const db = getFirestore(app);
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
  (db as any).settings?.({ experimentalForceLongPolling: true });
  console.info("Firestore: experimentalForceLongPolling enabled to improve transport stability.");
} catch (err) {
  console.warn("Firestore: could not enable experimentalForceLongPolling", err);
}