import axios from '@/axiosInstance';
import firebase from '@/firebase';
import { type User, type RegisterResponse, type RegisterPayload } from 'types';

async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> {
  const payload: RegisterPayload = {
    email,
    password,
    firstName,
    lastName,
  };

  const { data }: { data: RegisterResponse } = await axios.post(
    '/register',
    payload
  );

  await firebase.auth().signInWithCustomToken(data.firebaseToken);

  return data.user;
}

export default { register };
