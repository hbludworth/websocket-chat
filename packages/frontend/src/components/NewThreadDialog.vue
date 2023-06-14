<script setup lang="ts">
import { ref, type PropType, nextTick } from 'vue';
import serverProxy from '@/serverProxy';
import type { User, Thread } from 'types';
import MessagesSection from './MessagesSection.vue';

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
  threads: {
    type: Array as PropType<Thread[]>,
    required: true,
  },
});

const emit = defineEmits(['create', 'cancel']);

const email = ref('');

const matchingUser = ref<User>();
const noMatchingUser = ref(false);

const existingThread = ref<Thread>();

const message = ref('');

const miniMessagesSection = ref<HTMLDivElement>();

const selectUser = async () => {
  try {
    if (!email.value) {
      return;
    }

    matchingUser.value = await serverProxy.getUserByEmail(email.value);
    noMatchingUser.value = false;

    existingThread.value = props.threads.find(
      (thread) =>
        thread.userUuid1 === matchingUser.value?.uuid ||
        thread.userUuid2 === matchingUser.value?.uuid
    );

    await nextTick();
    miniMessagesSection.value?.scrollTo(
      0,
      miniMessagesSection.value.scrollHeight
    );
  } catch (err) {
    noMatchingUser.value = true;
    matchingUser.value = undefined;
  }
};

const sendMessage = async () => {
  try {
    if (!message.value) {
      return;
    }

    let threadUuid: string = '';

    if (existingThread.value) {
      threadUuid = existingThread.value.uuid;
      await serverProxy.createMessage({
        threadUuid: existingThread.value.uuid,
        message: message.value,
      });
    } else {
      const newThread = await serverProxy.createThread({
        recipientUserUuid: matchingUser.value!.uuid,
        message: message.value,
      });
      threadUuid = newThread.uuid;
    }

    email.value = '';
    message.value = '';
    matchingUser.value = undefined;
    noMatchingUser.value = false;

    emit('create', threadUuid);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        <h1
          class="title is-spaced is-size-4-desktop is-size-5-mobile has-text-primary"
        >
          Create New Thread
        </h1>

        <h2
          v-if="!matchingUser"
          class="subtitle is-size-6-desktop is-size-7-mobile has-text-primary mb-1"
        >
          Enter the email of the user you want to chat with
        </h2>

        <div class="columns is-centered">
          <div v-if="!matchingUser" class="column is-9">
            <input
              v-model="email"
              class="input mt-1"
              type="email"
              placeholder="Ex: john@doe.com"
              @keydown.enter="selectUser"
            />
          </div>
          <div v-if="!matchingUser" class="column is-3 has-text-right">
            <button
              class="button is-primary is-outlined is-rounded"
              :disabled="!email"
              @click="selectUser"
            >
              Select
            </button>
          </div>

          <div v-if="matchingUser" class="column is-9">
            <p class="subtitle has-text-primary mt-2">
              {{ matchingUser.firstName }}
              {{ matchingUser.lastName }}
            </p>
          </div>
          <div v-if="matchingUser" class="column has-text-right is-3">
            <button
              class="button is-primary is-outlined is-rounded"
              @click="
                matchingUser = undefined;
                noMatchingUser = false;
                email = '';
              "
            >
              Unselect
            </button>
          </div>
        </div>

        <p v-if="noMatchingUser" class="has-text-danger has-text-centered">
          No user found with that email.
        </p>

        <div v-if="matchingUser" class="has-text-centered">
          <div
            v-if="existingThread"
            class="mini-messages-section"
            ref="miniMessagesSection"
          >
            <messages-section :thread="existingThread" />
          </div>

          <div class="columns mt-5 is-centered">
            <div class="column is-10">
              <input
                v-model="message"
                class="input"
                type="text"
                placeholder="Send a message..."
                @keydown.enter="sendMessage"
              />
            </div>
            <div class="column is-2">
              <button
                class="button is-primary is-outlined is-rounded"
                :disabled="!message"
                @click="sendMessage"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div class="has-text-centered mt-6">
          <button class="button is-primary is-rounded" @click="$emit('cancel')">
            Cancel
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
