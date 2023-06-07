<script setup lang="ts">
import { ref, computed } from 'vue';
import serverProxy from '@/serverProxy';
import router from '@/router';
import { RouterLink } from 'vue-router';

const email = ref('');
const password = ref('');

const loading = ref(false);
const errorMessage = ref('');

const formComplete = computed(() => {
  if (!email.value || !password.value) {
    return false;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    return false;
  }

  return true;
});

const emailValidationError = ref('');
const validateEmail = () => {
  if (email.value && !/.+@.+\..+/.test(email.value)) {
    emailValidationError.value = 'Invalid email';
  } else {
    emailValidationError.value = '';
  }
};

const login = async () => {
  try {
    loading.value = true;
    await serverProxy.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    const errorCode = (err as any).code;
    if (
      errorCode === 'auth/wrong-password' ||
      errorCode === 'auth/user-not-found'
    ) {
      errorMessage.value = 'Invalid credentials';
    } else if ((err as any).message) {
      errorMessage.value = (err as any).message;
    } else {
      errorMessage.value = 'There was an unknown error';
    }
  } finally {
    loading.value = false;
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
            Log In
          </h1>

          <div class="columns mt-5 is-centered">
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
          <div class="columns is-centered">
            <div class="column is-half">
              <input
                v-model="password"
                class="input"
                type="password"
                placeholder="Password"
                @keypress.enter="login"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="mt-2 has-text-danger">
            {{ errorMessage }}
          </div>

          <div v-if="loading" class="columns is-centered">
            <div class="column is-half">
              <progress class="progress is-small is-primary my-6"></progress>
            </div>
          </div>
          <div v-else>
            <button
              @click="login"
              class="button is-primary is-outlined is-rounded mt-4"
              :disabled="!formComplete"
            >
              Log In
            </button>

            <div class="mt-5">
              Don't have an account yet?
              <RouterLink to="/register" class="ml-1"
                >Create Account</RouterLink
              >
            </div>
            <div class="mt-1">
              Forgot your password?
              <RouterLink to="/send_reset_password_email" class="ml-1"
                >Reset Password</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
