<script setup lang="ts">
import { computed, ref } from 'vue';
import store from '@/store';
import router from '@/router';
import serverProxy from '@/serverProxy';

const currentUser = computed(() => store.getters.user);

const firstName = ref(currentUser.value?.firstName || '');
const lastName = ref(currentUser.value?.lastName || '');
const email = ref(currentUser.value?.email || '');

const cancel = () => {
  router.push('/');
};

const saveEnabled = computed(() => {
  if (!firstName.value || !lastName.value || !email.value) {
    return false;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    return false;
  }

  if (firstName.value !== currentUser.value?.firstName) {
    return true;
  }

  if (lastName.value !== currentUser.value?.lastName) {
    return true;
  }

  if (email.value !== currentUser.value?.email) {
    return true;
  }

  return false;
});

const emailValidationError = ref('');
const validateEmail = () => {
  if (email.value && !/.+@.+\..+/.test(email.value)) {
    emailValidationError.value = 'Invalid email';
  } else {
    emailValidationError.value = '';
  }
};

const verificationDialog = ref(false);
const password = ref('');
const confirmLoading = ref(false);

const updatedSuccessfully = ref(false);
const errorMessage = ref('');

const confirmPassword = async () => {
  try {
    confirmLoading.value = true;
    await serverProxy.reauthenticateUser(password.value);
    password.value = '';
    await serverProxy.updateProfile(
      firstName.value,
      lastName.value,
      email.value
    );
    updatedSuccessfully.value = true;
    verificationDialog.value = false;
  } catch (err) {
    if (err && (err as any).code) {
      if ((err as any).code === 'auth/wrong-password') {
        errorMessage.value = 'The password you have provided is invalid.';
      } else {
        errorMessage.value = 'There was an unknown error';
      }
    }
  } finally {
    confirmLoading.value = false;
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
            Edit Profile
          </h1>

          <div v-if="updatedSuccessfully">
            <div
              class="is-flex is-align-items-center is-justify-content-center mt-6"
            >
              <span class="icon ml-2">
                <i class="mdi mdi-24px mdi-check-circle has-text-success"></i>
              </span>
              <span class="ml-2">Successfully updated profile!</span>
            </div>

            <button
              @click="updatedSuccessfully = false"
              class="button is-primary is-outlined is-rounded mt-5 mx-2"
            >
              Go Back
            </button>
            <RouterLink
              to="/"
              class="button is-primary is-outlined is-rounded mt-5 mx-2"
            >
              Go Home
            </RouterLink>
          </div>

          <div v-else>
            <div class="columns mt-5 is-centered">
              <div class="column is-one-fifth is-flex is-align-items-center">
                <b>First Name</b>
              </div>
              <div class="column is-half">
                <input
                  v-model="firstName"
                  class="input"
                  type="text"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div class="columns is-centered">
              <div class="column is-one-fifth is-flex is-align-items-center">
                <b>Last Name</b>
              </div>
              <div class="column is-half">
                <input
                  v-model="lastName"
                  class="input"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div class="columns is-centered">
              <div class="column is-one-fifth is-flex is-align-items-center">
                <b>Email</b>
              </div>
              <div class="column is-half">
                <input
                  v-model="email"
                  class="input"
                  type="email"
                  placeholder="Email"
                  @blur="validateEmail"
                />
                <div v-if="emailValidationError" class="mt-2 has-text-danger">
                  {{ emailValidationError }}
                </div>
              </div>
            </div>

            <div class="columns mt-5 is-centered">
              <button
                @click="cancel"
                class="button is-primary is-outlined is-rounded mx-2"
              >
                Cancel
              </button>
              <button
                class="button is-primary is-rounded mx-2"
                :disabled="!saveEnabled"
                @click="verificationDialog = true"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': verificationDialog }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <h1
            class="title is-spaced is-size-4-desktop is-size-5-mobile has-text-primary"
          >
            Confirm Password
          </h1>

          <div v-if="confirmLoading" class="columns is-centered">
            <div class="column is-half">
              <progress class="progress is-small is-primary my-6"></progress>
            </div>
          </div>
          <div v-else>
            <div class="columns is-centered">
              <div class="column is-three-fifths">
                <input
                  v-model="password"
                  class="input"
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>

            <div v-if="errorMessage" class="my-2 has-text-danger">
              {{ errorMessage }}
            </div>

            <div class="mt-5 mb-2">
              <button
                @click="verificationDialog = false"
                class="button is-primary is-outlined is-rounded mx-2"
              >
                Cancel
              </button>
              <button
                class="button is-primary is-rounded mx-2"
                @click="confirmPassword"
              >
                Save
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
