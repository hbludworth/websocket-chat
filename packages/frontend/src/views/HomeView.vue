<script setup lang="ts">
import store from '@/store';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const isAdmin = computed(() => store.getters.isAdmin);
const currentUser = computed(() => store.getters.user);
</script>

<template>
  <section class="section has-text-centered is-medium">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            Welcome, {{ currentUser ? currentUser.firstName : 'Guest' }}!
          </h1>
          <ul>
            <li v-if="currentUser" class="is-size-5-tablet">
              <b>Full Name:</b>
              <span class="ml-1"
                >{{ currentUser.firstName }} {{ currentUser.lastName }}</span
              >
            </li>
            <li v-if="currentUser" class="is-size-5-tablet">
              <b>Email:</b>
              <span class="ml-1">{{ currentUser.email }}</span>
            </li>
            <li v-if="currentUser" class="is-size-5-tablet">
              <b>Created:</b>
              <span class="ml-1">{{
                new Date(currentUser.createdOn).toLocaleString()
              }}</span>
            </li>
            <li class="is-size-5-tablet">
              <b>Authenticated:</b>
              <span class="icon ml-2">
                <i
                  v-if="isAuthenticated"
                  class="mdi mdi-check-circle has-text-success"
                ></i>
                <i v-else class="mdi mdi-close-circle has-text-danger"></i>
              </span>
            </li>
            <li class="is-size-5-tablet">
              <b>Admin:</b>
              <span class="icon ml-2">
                <i
                  v-if="isAdmin"
                  class="mdi mdi-check-circle has-text-success"
                ></i>
                <i v-else class="mdi mdi-close-circle has-text-danger"></i>
              </span>
            </li>
          </ul>

          <div class="mt-5">
            <RouterLink
              class="button is-primary is-outlined is-rounded mx-2"
              to="/profile"
              >Edit User Profile</RouterLink
            >
            <RouterLink
              class="button is-primary is-outlined is-rounded mx-2"
              to="/tests"
              >Run Access Tests</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
