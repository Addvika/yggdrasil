import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

// Public Firebase *web app* config for yggdrasil-497923. These values are not
// secrets: they ship verbatim in every client bundle and access is enforced by
// Firebase security rules, not by hiding the config (see the note in
// .env.production.example — "safe to commit"). Committed defaults keep
// clean-checkout builds working: Cloud Build / App Hosting / CI have no
// .env.production, and Next.js prerenders client components at build time, so
// a missing apiKey used to crash `next build` with auth/invalid-api-key.
// NEXT_PUBLIC_ env vars still take precedence when present.
const publicDefaults = {
  apiKey: 'AIzaSyBURyw8WUWgdtdXIecSoWB31I9LQLMIRIM',
  authDomain: 'yggdrasil-497923.firebaseapp.com',
  projectId: 'yggdrasil-497923',
  storageBucket: 'yggdrasil-497923.firebasestorage.app',
  messagingSenderId: '168739896450',
  appId: '1:168739896450:web:d4df0d16873ceb8b7b489b',
  measurementId: 'G-GZZD2WH17Y',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? publicDefaults.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? publicDefaults.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? publicDefaults.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? publicDefaults.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? publicDefaults.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? publicDefaults.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? publicDefaults.measurementId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'us-central1');
const storage = getStorage(app);

let analytics: Analytics | null = null;
const analyticsReady = typeof window !== 'undefined'
  ? isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }

      return analytics;
    })
  : Promise.resolve(null);

export { app, auth, db, functions, storage, analytics, analyticsReady };
