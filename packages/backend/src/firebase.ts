import * as admin from 'firebase-admin';

export function initializeFirebase(cb: (err?: any) => void) {
  const jsonCredentials = process.env.FIREBASE_CREDENTIALS_WC;

  if (!jsonCredentials) {
    cb('No Firebase credentials found');
  } else {
    const firebaseCredentials: admin.ServiceAccount =
      JSON.parse(jsonCredentials);
    admin.initializeApp({
      credential: admin.credential.cert(firebaseCredentials),
    });
    cb();
  }
}

export default admin;
