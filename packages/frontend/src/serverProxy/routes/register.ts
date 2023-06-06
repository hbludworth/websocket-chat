import axios from '@/axiosInstance';
import firebase from '@/firebase';
import { type User } from '@/store';

export interface RegisterResponse {
  user: User;
  firebaseToken: string;
}

async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> {
  const { data }: { data: RegisterResponse } = await axios.post('/register', {
    // FIXME create type
    email,
    password,
    firstName,
    lastName,
  });

  await firebase.auth().signInWithCustomToken(data.firebaseToken);

  return data.user;
}

export default { register };
