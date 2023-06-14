<script setup lang="ts">
import store from '@/store';
import { computed } from 'vue';

const currentUser = computed(() => store.getters.user);
const isAuthenticated = computed(() => store.getters.isAuthenticated);
</script>

<template>
  <section class="section has-text-centered is-large">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            Welcome, {{ currentUser ? currentUser.firstName : 'Guest' }}!
          </h1>

          <h2 class="subtitle mt-6">
            This site provides a basic example of using WebSockets with Vue 3
            and Node.js to create a real-time chat application.
          </h2>

          <div class="mt-6">
            <RouterLink
              v-if="isAuthenticated"
              class="button is-primary is-outlined is-rounded mx-2"
              to="/profile"
              >Edit Profile</RouterLink
            >
            <RouterLink
              v-if="isAuthenticated"
              class="button is-primary is-rounded mx-2"
              to="/chats"
              >Start Chatting</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
