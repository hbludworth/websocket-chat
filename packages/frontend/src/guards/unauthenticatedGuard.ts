import { type NavigationGuard } from 'vue-router';
import store from '@/store';

const unauthenticatedGuard: NavigationGuard = (_to, _from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
  } else {
    next('/401_unauthenticated');
  }
};

export default unauthenticatedGuard;
