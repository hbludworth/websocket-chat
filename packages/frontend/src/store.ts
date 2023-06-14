import { reactive } from 'vue';
import { type User } from 'types';

export interface State {
  user: User | null;
  idToken: string | null;
  socket: WebSocket | null;
}

const state: State = reactive({
  user: null,
  idToken: null,
  socket: null,
});

export default {
  setUser: (user: User) => {
    state.user = user;
  },
  setToken: (token: string) => {
    state.idToken = token;
  },
  setSocket: (socket: WebSocket) => {
    state.socket = socket;
  },
  logout: () => {
    state.user = null;
    state.idToken = null;
    state.socket = null;
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
    get socket() {
      return state.socket;
    },
  },
};
