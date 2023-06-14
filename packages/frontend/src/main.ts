import './assets/main.scss';
import firebase from './firebase';
import { createApp, type App as AppType } from 'vue';
import App from './App.vue';
import LoadingScreen from './LoadingScreen.vue';
import router from './router';
import store from './store';
import serverProxy from './serverProxy';
import createWebsocket from './websocket';

let app: AppType<Element>;
let appLoaded = false;

app = createApp(LoadingScreen);
app.mount('#app');

firebase.auth().onAuthStateChanged(async (user) => {
  const { currentUser } = firebase.auth();

  if (currentUser && user && user.email && user.displayName) {
    const tokenResponse = await currentUser.getIdTokenResult();

    store.setToken(tokenResponse.token);

    try {
      const user = await serverProxy.getUser(currentUser.uid);

      store.setUser(user);

      createWebsocket();
    } catch (err) {
      console.error('Error initializing site', err);
    }
  }

  if (!appLoaded) {
    appLoaded = true;

    app.unmount();
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
});
