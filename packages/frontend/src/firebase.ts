import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCq164R5bmwFnpgdYYXAQx8JWVEM-eU1-Y',
  authDomain: 'hb-firebase-template.firebaseapp.com',
  projectId: 'hb-firebase-template',
  storageBucket: 'hb-firebase-template.appspot.com',
  messagingSenderId: '817951649771',
  appId: '1:817951649771:web:c6e480650401f33ab933ae',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
