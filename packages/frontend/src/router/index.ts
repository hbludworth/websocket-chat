import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import authenticatedGuard from '@/guards/authenticatedGuard';
import unauthenticatedGuard from '@/guards/unauthenticatedGuard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chats',
      name: 'chats',
      component: () => import('../views/ChatView.vue'),
      beforeEnter: authenticatedGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: unauthenticatedGuard,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      beforeEnter: unauthenticatedGuard,
    },
    {
      path: '/send_reset_password_email',
      name: 'send_reset_password_email',
      component: () => import('../views/SendResetPasswordEmailView.vue'),
      beforeEnter: unauthenticatedGuard,
    },
    {
      path: '/reset_password',
      name: 'reset_password',
      component: () => import('../views/ResetPasswordView.vue'),
      beforeEnter: unauthenticatedGuard,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: authenticatedGuard,
    },
    {
      path: '/401',
      name: '401',
      component: () => import('../views/401View.vue'),
    },
    {
      path: '/401_unauthenticated',
      name: '401_unauthenticated',
      component: () => import('../views/401UnauthenticatedView.vue'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('../views/403View.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('../views/404View.vue'),
      props: true,
    },
  ],
});

export default router;
