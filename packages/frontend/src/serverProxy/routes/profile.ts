import axios from '@/axiosInstance';
import firebase from '@/firebase';
import store from '@/store';

const updateProfile = async (
  firstName?: string,
  lastName?: string,
  email?: string
): Promise<void> => {
  // FIXME add type
  const payload = {
    firstName,
    lastName,
    email,
  };

  await axios.patch('/profile', payload);

  const { currentUser } = firebase.auth();

  if (currentUser && store.getters.user) {
    if (payload.firstName || payload.lastName) {
      await currentUser.updateProfile({
        displayName: `${payload.firstName || store.getters.user.firstName} ${
          payload.lastName || store.getters.user.lastName
        }`,
      });
    }

    if (payload.email) {
      await currentUser.updateEmail(payload.email);
      store.setUser({
        ...store.getters.user,
        email: payload.email,
      });
    }

    if (payload.firstName) {
      store.setUser({
        ...store.getters.user,
        firstName: payload.firstName,
      });
    }

    if (payload.lastName) {
      store.setUser({
        ...store.getters.user,
        lastName: payload.lastName,
      });
    }
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
