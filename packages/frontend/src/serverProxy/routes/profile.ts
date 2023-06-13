import axios from '@/axiosInstance';
import firebase from '@/firebase';
import store from '@/store';
import { type UpdateProfilePayload } from 'types';

const updateProfile = async (
  firstName: string,
  lastName: string,
  email: string
): Promise<void> => {
  const payload: UpdateProfilePayload = {
    firstName,
    lastName,
    email,
  };

  await axios.patch('/profile', payload);

  const { currentUser } = firebase.auth();

  if (currentUser && store.getters.user) {
    await currentUser.updateProfile({
      displayName: `${payload.firstName} ${payload.lastName}`,
    });

    await currentUser.updateEmail(payload.email);

    store.setUser({
      ...store.getters.user,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    });
  }
};

const reauthenticateUser = async (password: string): Promise<void> => {
  const { currentUser } = firebase.auth();

  if (currentUser && currentUser.email) {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    await currentUser.reauthenticateWithCredential(credential);
  }
};

export default {
  updateProfile,
  reauthenticateUser,
};
