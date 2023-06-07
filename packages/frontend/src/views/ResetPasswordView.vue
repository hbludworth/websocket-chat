<script setup lang="ts">
import router from '@/router';
import { onMounted, ref, computed } from 'vue';
import serverProxy from '@/serverProxy';

const oobCode = router.currentRoute.value.query.oobCode as string;

const emailBeingReset = ref('');
const errorMessage = ref('');
const verifyingCode = ref(true);
const loading = ref(false);
const submitted = ref(false);

const newPassword = ref('');
const confirmNewPassword = ref('');

onMounted(async () => {
  try {
    emailBeingReset.value = await serverProxy.verifyPasswordResetCode(oobCode);
  } catch (err) {
    handleAuthError(err as any);
  } finally {
    verifyingCode.value = false;
  }
});

const handleAuthError = (err: { code: string; message: string }) => {
  const { code } = err;
  if (code === 'auth/expired-action-code') {
    errorMessage.value = 'The code you have provided is expired.';
  } else if (code === 'auth/invalid-action-code') {
    errorMessage.value = 'The code you have provided is invalid.';
  } else if (code === 'auth/user-not-found') {
    errorMessage.value = 'No user was found for the given code.';
  } else {
    errorMessage.value = 'There was an unknown error.';
  }
};

const formComplete = computed(() => {
  if (!newPassword.value || !confirmNewPassword.value) {
    return false;
  }

  if (newPassword.value.length < 8) {
    return false;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    return false;
  }

  return true;
});

const passwordValidationError = ref('');
const validatePassword = () => {
  if (newPassword.value && newPassword.value.length < 8) {
    passwordValidationError.value = 'Password must be at least 8 characters';
  } else {
    passwordValidationError.value = '';
  }
};

const confirmPasswordValidationError = ref('');
const validateConfirmPassword = () => {
  if (
    confirmNewPassword.value &&
    newPassword.value !== confirmNewPassword.value
  ) {
    confirmPasswordValidationError.value = 'Passwords do not match';
  } else {
    confirmPasswordValidationError.value = '';
  }
};

const resetPassword = async () => {
  try {
    loading.value = true;
    await serverProxy.resetPassword(oobCode, newPassword.value);
    await serverProxy.login(emailBeingReset.value, newPassword.value);
  } catch (err) {
    handleAuthError(err as any);
  } finally {
    loading.value = false;
    submitted.value = true;
  }
};
</script>

<template>
  <div v-if="verifyingCode" class="columns is-centered">
    <div class="column is-half">
      <progress class="progress is-small is-primary my-6"></progress>
    </div>
  </div>

  <section v-else class="section has-text-centered is-medium">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            {{
              emailBeingReset ? 'Resetting Password' : 'Cannot Reset Password'
            }}
          </h1>
          <h2 v-if="emailBeingReset" class="subtitle is-size-5-tablet">
            {{ emailBeingReset }}
          </h2>

          <div v-if="!submitted">
            <div class="columns mt-5 is-centered">
              <div class="column is-half">
                <input
                  v-model="newPassword"
                  class="input"
                  type="password"
                  placeholder="Password"
                  @blur="validatePassword"
                />
                <div
                  v-if="passwordValidationError"
                  class="mt-2 has-text-danger"
                >
                  {{ passwordValidationError }}
                </div>
              </div>
            </div>
            <div class="columns is-centered">
              <div class="column is-half">
                <input
                  v-model="confirmNewPassword"
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
                @click="resetPassword"
                class="button is-primary is-outlined is-rounded mt-4"
                :disabled="!formComplete"
              >
                Submit
              </button>

              <div class="mt-5">
                <RouterLink to="/send_reset_password_email" class="ml-1"
                  >Send Again</RouterLink
                >
              </div>
            </div>
          </div>

          <div v-else>
            Your password has successfully been reset.

            <div class="mt-5">
              <RouterLink to="/" class="ml-1">Go Home</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
