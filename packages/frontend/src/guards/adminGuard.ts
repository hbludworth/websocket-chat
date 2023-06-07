import { type NavigationGuard } from 'vue-router';
import store from '@/store';

const adminGuard: NavigationGuard = (_to, _from, next) => {
  if (store.getters.isAdmin) {
    next();
  } else {
    next('/403');
  }
};

export default adminGuard;
