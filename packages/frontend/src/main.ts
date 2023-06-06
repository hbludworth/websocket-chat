import './assets/main.scss';
import firebase from './firebase';
import { createApp, type App as AppType } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import serverProxy from './serverProxy';

let app: AppType<Element>;

firebase.auth().onAuthStateChanged(async (user) => {
  const { currentUser } = firebase.auth();

  if (currentUser && user && user.email && user.displayName) {
    const tokenResponse = await currentUser.getIdTokenResult();

    store.setToken(tokenResponse.token);

    try {
      const user = await serverProxy.getUser(currentUser.uid);

      store.setUser(user);
    } catch (err) {
      console.error('Error initializing site', err);
    }
  }

  if (!app) {
    app = createApp(App);

    app.use(router);

    app.mount('#app');
  }
});
