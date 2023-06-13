import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDD6vAJnvb6t2Of4qKjJ8cM43KCXSWlh14',
  authDomain: 'hb-websocket-chat.firebaseapp.com',
  projectId: 'hb-websocket-chat',
  storageBucket: 'hb-websocket-chat.appspot.com',
  messagingSenderId: '582939464507',
  appId: '1:582939464507:web:e96e696b8b39b194ed9d1e',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
