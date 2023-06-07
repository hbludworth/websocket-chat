<script setup lang="ts">
import { ref, computed } from 'vue';
import serverProxy from '@/serverProxy';

const email = ref('');
const loading = ref(false);

const emailSent = ref(false);
const errorMessage = ref('');

const formComplete = computed(() => {
  if (!email.value) {
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

const title = computed(() =>
  emailSent.value ? 'Check Your Email' : 'Reset Password'
);

const sendEmail = async () => {
  try {
    loading.value = true;
    await serverProxy.sendResetPasswordEmail(email.value);
    emailSent.value = true;
  } catch (err) {
    const code = (err as any).code;
    if (code === 'auth/invalid-email') {
      errorMessage.value =
        'The email you have provided is invalid. Please try again.';
    } else if (code === 'auth/user-not-found') {
      errorMessage.value =
        'There is no user associated with the given email address.';
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
            {{ title }}
          </h1>

          <div v-if="!emailSent">
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
                @click="sendEmail"
                class="button is-primary is-outlined is-rounded mt-4"
                :disabled="!formComplete"
              >
                Send Email
              </button>
            </div>
          </div>

          <div v-else>
            <div class="columns mt-5 is-centered">
              <div class="column is-half">
                Please check your inbox. A link has been sent to you that will
                help you reset your password.

                <div class="mt-5">
                  <RouterLink to="/login" class="ml-1"
                    >Back to login</RouterLink
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
