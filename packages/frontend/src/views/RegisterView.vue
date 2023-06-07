<script setup lang="ts">
import { ref, computed } from 'vue';
import serverProxy from '@/serverProxy';
import router from '@/router';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const loading = ref(false);
const errorMessage = ref('');

const formComplete = computed(() => {
  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    return false;
  }

  if (!/.+@.+\..+/.test(email.value)) {
    return false;
  }

  if (password.value.length < 8) {
    return false;
  }

  if (password.value !== confirmPassword.value) {
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

const passwordValidationError = ref('');
const validatePassword = () => {
  if (password.value && password.value.length < 8) {
    passwordValidationError.value = 'Password must be at least 8 characters';
  } else {
    passwordValidationError.value = '';
  }
};

const confirmPasswordValidationError = ref('');
const validateConfirmPassword = () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordValidationError.value = 'Passwords do not match';
  } else {
    confirmPasswordValidationError.value = '';
  }
};

const register = async () => {
  try {
    loading.value = true;
    await serverProxy.register(
      email.value,
      password.value,
      firstName.value,
      lastName.value
    );
    router.push('/');
  } catch (err) {
    errorMessage.value = err as string;
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
            Create Account
          </h1>

          <div class="columns mt-5 is-centered">
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
                @blur="validatePassword"
              />
              <div v-if="passwordValidationError" class="mt-2 has-text-danger">
                {{ passwordValidationError }}
              </div>
            </div>
          </div>
          <div class="columns is-centered">
            <div class="column is-half">
              <input
                v-model="confirmPassword"
                class="input"
                type="password"
                placeholder="Confirm Password"
                @blur="validateConfirmPassword"
              />
              <div
                v-if="confirmPasswordValidationError"
                class="mt-2 has-text-danger"
              >
                {{ confirmPasswordValidationError }}
              </div>
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
              @click="register"
              class="button is-primary is-outlined is-rounded mt-4"
              :disabled="!formComplete"
            >
              Create Account
            </button>

            <div class="mt-5">
              Already have an account?
              <RouterLink to="/login" class="ml-1">Log In</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
