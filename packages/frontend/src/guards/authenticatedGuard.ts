import { type NavigationGuard } from 'vue-router';
import store from '@/store';

const authenticatedGuard: NavigationGuard = (_to, _from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    next('/401');
  }
};

export default authenticatedGuard;
