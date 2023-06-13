import * as admin from 'firebase-admin';
import AWS from 'aws-sdk';

export function initializeFirebase(cb: (err?: any) => void) {
  const s3 = new AWS.S3();
  s3.getObject(
    {
      Bucket: 'hb-websocket-chat',
      Key: 'firebase_credentials.json',
    },
    (err, data) => {
      if (err) {
        cb(err);
      } else if (data.Body) {
        const firebaseCredentials: admin.ServiceAccount = JSON.parse(
          data.Body.toString()
        );
        admin.initializeApp({
          credential: admin.credential.cert(firebaseCredentials),
        });
        cb();
      } else {
        cb('Failed to retrieve Firebase credentials from S3');
      }
    }
  );
}

export default admin;
