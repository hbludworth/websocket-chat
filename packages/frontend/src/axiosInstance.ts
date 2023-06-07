import axios from 'axios';
import store from '@/store';
import firebase from '@/firebase';
import router from '@/router';

const host =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : '';

const axiosInstance = axios.create({
  baseURL: `${host}/api`,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.config && error.response && error.response.status === 407) {
      const { currentUser } = firebase.auth();

      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult(true);
          store.setToken(idTokenResult.token);
        } catch (err) {
          console.error('Error refreshing Firebase token', err);
        }
      }

      return axiosInstance(error.config);
    }

    return Promise.reject(new Error(error.response.status));
  }
);

axiosInstance.interceptors.request.use((config) => {
  if (store.getters.idToken) {
    config.headers.Authorization = store.getters.idToken;
  }

  return config;
});

export default axiosInstance;
