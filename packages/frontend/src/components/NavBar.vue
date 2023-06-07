<template>
  <nav class="navbar is-primary" role="navigation">
    <div class="container">
      <div class="navbar-brand">
        <RouterLink class="navbar-item" to="/">Home</RouterLink>

        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': menuIsActive }"
          @click="menuIsActive = !menuIsActive"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': menuIsActive }">
        <div class="navbar-end">
          <RouterLink v-if="isAuthenticated" class="navbar-item" to="/profile"
            >Profile</RouterLink
          >
          <RouterLink class="navbar-item" to="/tests">Tests</RouterLink>
          <div
            v-if="isAuthenticated"
            class="nav-bar-item is-flex is-align-items-center ml-4"
          >
            <a
              @click="logout"
              class="button is-outlined is-rounded has-text-primary"
              >Log Out</a
            >
          </div>
          <RouterLink v-else class="navbar-item" to="/login">
            <a class="button is-outlined is-rounded has-text-primary">Log In</a>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import router from '@/router';
import store from '@/store';
import serverProxy from '@/serverProxy';

const menuIsActive = ref(false);

const logout = async () => {
  store.logout();
  router.push('/login');
  await serverProxy.logout();
};

const isAuthenticated = computed(() => store.getters.isAuthenticated);
</script>
