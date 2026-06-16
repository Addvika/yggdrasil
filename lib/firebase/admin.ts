import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn('Firebase Admin skipped initialization due to missing environment variables.');
  }
}

const isBuildTime = !process.env.FIREBASE_ADMIN_PROJECT_ID;

const adminDb = isBuildTime ? ({} as admin.firestore.Firestore) : admin.firestore();
const adminAuth = isBuildTime ? ({} as admin.auth.Auth) : admin.auth();

export { adminDb, adminAuth };
