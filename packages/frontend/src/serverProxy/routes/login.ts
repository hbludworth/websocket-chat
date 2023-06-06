import firebase from '@/firebase';

async function login(email: string, password: string): Promise<void> {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export default {
  login,
};
