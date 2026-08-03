import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  enableIndexedDbPersistence,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studyos-demo",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studyos-demo.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc",
};

export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  !import.meta.env.VITE_FIREBASE_API_KEY;

export const useEmulator =
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let emulatorConnected = false;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
    if (useEmulator && !emulatorConnected) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    }
  }
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
    if (useEmulator && !emulatorConnected) {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
      emulatorConnected = true;
    } else {
      enableIndexedDbPersistence(db).catch(() => {
        // Multiple tabs or unsupported browser — safe to ignore for MVP.
      });
    }
  }
  return db;
}
