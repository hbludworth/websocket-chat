import { reactive } from 'vue';
import { type User } from 'types';

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
