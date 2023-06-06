import { reactive } from 'vue';

// FIXME will move to a shared types package
export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export interface State {
  user: User | null;
  idToken: string | null;
}

const state: State = reactive({
  user: null,
  idToken: null,
});

export default {
  setUser: (user: User) => {
    state.user = user;
  },
  setToken: (token: string) => {
    state.idToken = token;
  },
  logout: () => {
    state.user = null;
    state.idToken = null;
  },
  getters: {
    get isAuthenticated() {
      return !!state.user;
    },
    get user() {
      return state.user;
    },
    get idToken() {
      return state.idToken;
    },
  },
};
