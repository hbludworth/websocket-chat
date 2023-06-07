<script setup lang="ts">
import serverProxy from '@/serverProxy';
import { ref } from 'vue';

const openRouteMessage = ref('Not Yet Tested');
const openRouteStatus = ref<boolean>();
const testOpenRoute = async () => {
  try {
    await serverProxy.testOpenRequest();
    openRouteMessage.value = '200 - OK';
    openRouteStatus.value = true;
  } catch (status) {
    openRouteMessage.value = `${status} - Internal Error`;
    openRouteStatus.value = false;
  }
};

const authenticatedRouteMessage = ref('Not Yet Tested');
const authenticatedRouteStatus = ref<boolean>();
const testAuthenticatedRoute = async () => {
  try {
    await serverProxy.testAuthenticatedRequest();
    authenticatedRouteMessage.value = '200 - OK';
    authenticatedRouteStatus.value = true;
  } catch (status) {
    authenticatedRouteMessage.value = `${status} - Unauthorized`;
    authenticatedRouteStatus.value = false;
  }
};

const adminRouteMessage = ref('Not Yet Tested');
const adminRouteStatus = ref<boolean>();
const testAdminRoute = async () => {
  try {
    await serverProxy.testAdminRequest();
    adminRouteMessage.value = '200 - OK';
    adminRouteStatus.value = true;
  } catch (status) {
    adminRouteMessage.value = `${status} - Forbidden`;
    adminRouteStatus.value = false;
  }
};

const nonExistentRouteMessage = ref('Not Yet Tested');
const nonExistentRouteStatus = ref<boolean>();
const testNonExistentRoute = async () => {
  try {
    await serverProxy.testNonExistentRequest();
    nonExistentRouteMessage.value = '200 - OK';
    nonExistentRouteStatus.value = true;
  } catch (status) {
    nonExistentRouteMessage.value = `${status} - Not Found`;
    nonExistentRouteStatus.value = false;
  }
};
</script>

<template>
  <section class="section has-text-centered is-medium">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            Access Tests
          </h1>
          <h2 class="subtitle">
            These simple tests allow you to see how the application behaves
            depending on the current user's authentication and admin status.
          </h2>

          <h2 class="subtitle">
            Logging in, logging out, and changing admin status will affect the
            results.
          </h2>

          <div class="columns mt-6 is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Open Backend Route</b>
            </div>

            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <span class="icon mr-2">
                <i
                  v-if="openRouteStatus === true"
                  class="mdi mdi-24px mdi-check-circle has-text-success"
                ></i>
                <i
                  v-else-if="openRouteStatus === false"
                  class="mdi mdi-24px mdi-close-circle has-text-danger"
                ></i>
                <i v-else class="mdi mdi-24px mdi-circle has-text-warning"></i>
              </span>
              <b>{{ openRouteMessage }}</b>
            </div>
            <div class="column is-one-third">
              <button
                @click="testOpenRoute"
                class="button is-primary is-rounded mx-2"
              >
                Send Request
              </button>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Authenticated Backend Route</b>
            </div>

            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <span class="icon mr-2">
                <i
                  v-if="authenticatedRouteStatus === true"
                  class="mdi mdi-24px mdi-check-circle has-text-success"
                ></i>
                <i
                  v-else-if="authenticatedRouteStatus === false"
                  class="mdi mdi-24px mdi-close-circle has-text-danger"
                ></i>
                <i v-else class="mdi mdi-24px mdi-circle has-text-warning"></i>
              </span>
              <b>{{ authenticatedRouteMessage }}</b>
            </div>
            <div class="column is-one-third">
              <button
                @click="testAuthenticatedRoute"
                class="button is-primary is-rounded mx-2"
              >
                Send Request
              </button>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Admin-Only Backend Route</b>
            </div>

            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <span class="icon mr-2">
                <i
                  v-if="adminRouteStatus === true"
                  class="mdi mdi-24px mdi-check-circle has-text-success"
                ></i>
                <i
                  v-else-if="adminRouteStatus === false"
                  class="mdi mdi-24px mdi-close-circle has-text-danger"
                ></i>
                <i v-else class="mdi mdi-24px mdi-circle has-text-warning"></i>
              </span>
              <b>{{ adminRouteMessage }}</b>
            </div>
            <div class="column is-one-third">
              <button
                @click="testAdminRoute"
                class="button is-primary is-rounded mx-2"
              >
                Send Request
              </button>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Non-Existent Backend Route</b>
            </div>

            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <span class="icon mr-2">
                <i
                  v-if="nonExistentRouteStatus === true"
                  class="mdi mdi-24px mdi-check-circle has-text-success"
                ></i>
                <i
                  v-else-if="nonExistentRouteStatus === false"
                  class="mdi mdi-24px mdi-close-circle has-text-danger"
                ></i>
                <i v-else class="mdi mdi-24px mdi-circle has-text-warning"></i>
              </span>
              <b>{{ nonExistentRouteMessage }}</b>
            </div>
            <div class="column is-one-third">
              <button
                @click="testNonExistentRoute"
                class="button is-primary is-rounded mx-2"
              >
                Send Request
              </button>
            </div>
          </div>

          <div class="columns mt-6 is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Open Frontend Page</b>
            </div>
            <div class="column is-one-third"></div>
            <div class="column is-one-third">
              <RouterLink
                to="/tests/open"
                class="button is-primary is-rounded mx-2"
                target="_blank"
              >
                Go To Page
                <span class="icon ml-1">
                  <i class="mdi mdi-open-in-new"></i>
                </span>
              </RouterLink>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Authenticated Frontend Page</b>
            </div>
            <div class="column is-one-third"></div>
            <div class="column is-one-third">
              <RouterLink
                to="/tests/auth"
                class="button is-primary is-rounded mx-2"
                target="_blank"
              >
                Go To Page
                <span class="icon ml-1">
                  <i class="mdi mdi-open-in-new"></i>
                </span>
              </RouterLink>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Admin-Only Frontend Page</b>
            </div>
            <div class="column is-one-third"></div>
            <div class="column is-one-third">
              <RouterLink
                to="/tests/admin"
                class="button is-primary is-rounded mx-2"
                target="_blank"
              >
                Go To Page
                <span class="icon ml-1">
                  <i class="mdi mdi-open-in-new"></i>
                </span>
              </RouterLink>
            </div>
          </div>

          <div class="columns is-centered">
            <div
              class="column is-one-third is-flex is-align-items-center is-justify-content-center"
            >
              <b>Non-Existent Frontend Page</b>
            </div>
            <div class="column is-one-third"></div>
            <div class="column is-one-third">
              <RouterLink
                to="/tests/non_existent"
                class="button is-primary is-rounded mx-2"
                target="_blank"
              >
                Go To Page
                <span class="icon ml-1">
                  <i class="mdi mdi-open-in-new"></i>
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
