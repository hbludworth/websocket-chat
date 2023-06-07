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

          <h2 class="subtitle mt-6">
            This site provides a basic template for implementing Firebase
            Authentication in a MEVN application. It can be used to quickly
            understand how to implement Firebase Authentication into your own
            project.
          </h2>

          <h2 class="subtitle mt-2">
            On this page, you can see information about the current user.
            Navigating to the tests page allows you to perform a number of tests
            on both backend routes and frontend views to understand how this
            template works.
          </h2>

          <h2 class="subtitle mt-2">
            If you have created an account and have logged in, you will see the
            option to edit your profile. In order to demonstrate Firebase
            reauthentication, you will be required to enter your password before
            you can edit your profile.
          </h2>

          <h2 class="subtitle mt-2">
            For demonstration purposes, you can also change your administrator
            status from the profile page. This functionality is not recommended
            in a production environment.
          </h2>

          <h2 class="subtitle mt-2">
            I hope you find this template useful. The source code is available
            on GitHub at the link in the footer. If you have any questions, feel
            free to reach out via email.
          </h2>

          <div class="mt-6">
            <RouterLink
              v-if="isAuthenticated"
              class="button is-primary is-outlined is-rounded mx-2"
              to="/profile"
              >Edit Profile</RouterLink
            >
            <RouterLink
              class="button is-primary is-outlined is-rounded mx-2"
              to="/tests"
              >Access Tests</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
