<script setup lang="ts">
import serverProxy from '@/serverProxy';
import type { CreateMessagePayload, Thread, WebSocketPayload } from 'types';
import { onMounted, ref, computed, nextTick, watch } from 'vue';
import store from '@/store';
import LoadingScreen from '@/LoadingScreen.vue';
import NewThreadDialog from '@/components/NewThreadDialog.vue';
import MessagesSection from '@/components/MessagesSection.vue';

const threads = ref<Thread[]>([]);
const socket = computed(() => store.getters.socket!);
const currentUser = computed(() => store.getters.user!);
const loading = ref(false);

const message = ref('');

const selectedThread = ref<Thread>();

const messagesSection = ref<HTMLDivElement>();

const newThreadDialog = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    threads.value = await serverProxy.getUserThreads();

    if (threads.value.length > 0) {
      selectedThread.value = threads.value[0];
    }

    setupSocketListener();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;

    await nextTick();
    messagesSection.value?.scrollTo(0, messagesSection.value.scrollHeight);
  }
});

const setupSocketListener = () => {
  socket.value.onmessage = async (event) => {
    const message: WebSocketPayload = JSON.parse(await event.data);

    switch (message.type) {
      case 'NEW_THREAD': {
        threads.value.unshift(message.body);
        break;
      }
      case 'NEW_MESSAGE': {
        const thread = threads.value.find(
          (thread) => thread.uuid === message.body.threadUuid
        );
        if (thread) {
          thread.messages.push(message.body);
        }

        const threadUuids = threads.value.map((thread) => thread.uuid);
        const threadIndex = threadUuids.indexOf(message.body.threadUuid);

        if (threadIndex !== 0) {
          const thread = threads.value.splice(threadIndex, 1)[0];
          threads.value.unshift(thread);
        }

        break;
      }
    }
  };
};

const sendMessage = async () => {
  try {
    if (!selectedThread.value || !message.value) {
      throw new Error('Invalid thread or message');
    }

    const payload: CreateMessagePayload = {
      threadUuid: selectedThread.value.uuid,
      message: message.value,
    };

    const newMessage = await serverProxy.createMessage(payload);

    selectedThread.value.messages.push(newMessage);

    const threadUuids = threads.value.map((thread) => thread.uuid);
    const threadIndex = threadUuids.indexOf(selectedThread.value.uuid);

    if (threadIndex !== 0) {
      const thread = threads.value.splice(threadIndex, 1)[0];
      threads.value.unshift(thread);
    }

    message.value = '';

    await nextTick();
    messagesSection.value?.scrollTo(0, messagesSection.value.scrollHeight);
  } catch (err) {
    console.error(err);
  }
};

const handleThreadDialogCreate = async (threadUuid: string): Promise<void> => {
  try {
    newThreadDialog.value = false;

    threads.value = await serverProxy.getUserThreads();

    selectedThread.value = threads.value.find(
      (thread) => thread.uuid === threadUuid
    );

    await nextTick();
    messagesSection.value?.scrollTo(0, messagesSection.value.scrollHeight);
  } catch (err) {
    console.error(err);
  }
};

const newThreadDialogKey = ref(0);
const handleThreadDialogCancel = () => {
  newThreadDialog.value = false;
  newThreadDialogKey.value += 1;
};

watch(selectedThread, async () => {
  await nextTick();
  messagesSection.value?.scrollTo(0, messagesSection.value.scrollHeight);
});
</script>

<template>
  <loading-screen v-if="loading" />
  <div v-else class="mx-5 my-5 chat-main">
    <div class="columns is-centered">
      <div class="column is-one-third" @click="selectedThread = undefined">
        <div class="columns is-centered mb-0">
          <div class="column is-half">
            <h1
              class="title is-spaced is-size-4-desktop is-size-5-mobile has-text-primary mb-4"
            >
              Threads
            </h1>
          </div>
          <div
            class="column is-half pb-0 is-flex is-flex-direction-row-reverse"
          >
            <button
              class="button is-primary is-outlined is-rounded is-small"
              @click="newThreadDialog = true"
              @click.stop
            >
              New Thread
            </button>
          </div>
        </div>

        <div class="threads-section">
          <div
            class="box mb-2 thread-box"
            :class="{
              'has-background-primary-light':
                selectedThread?.uuid === thread.uuid,
            }"
            v-for="thread in threads"
            :key="thread.uuid"
            @click="selectedThread = thread"
            @click.stop
          >
            <h1 class="subtitle mb-0 has-text-primary">
              {{
                currentUser.uuid !== thread.userUuid1
                  ? thread.user1.firstName
                  : thread.user2.firstName
              }}
              {{
                currentUser.uuid !== thread.userUuid1
                  ? thread.user1.lastName
                  : thread.user2.lastName
              }}
            </h1>
            <p v-if="thread.messages.length > 0">
              {{ thread.messages[thread.messages.length - 1].content }}
            </p>
          </div>
        </div>

        <div v-if="threads.length === 0" class="pt-6">
          <h1 class="title has-text-centered has-text-primary mt-6 pt-6">
            No Threads
          </h1>
          <h2 class="subtitle has-text-centered mt-1">
            Create a new thread to being chatting
          </h2>
        </div>
      </div>
      <div class="column is-two-thirds px-5">
        <div class="columns is-centered mb-0">
          <div class="column is-12">
            <h1
              class="title is-spaced is-size-4-desktop is-size-5-mobile has-text-primary mb-4"
            >
              Messages
            </h1>
          </div>
        </div>

        <div v-if="selectedThread">
          <div class="messages-section" ref="messagesSection">
            <messages-section :thread="selectedThread" />
          </div>
          <div class="columns mt-5 is-centered">
            <div class="column is-11">
              <input
                v-model="message"
                class="input"
                type="text"
                placeholder="Type a message..."
                @keydown.enter="sendMessage"
              />
            </div>
            <div class="column is-1">
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

        <div v-else class="pt-6">
          <h1 class="title has-text-centered has-text-primary mt-6 pt-6">
            No Thread Selected
          </h1>
        </div>
      </div>
    </div>
    <new-thread-dialog
      :key="newThreadDialogKey"
      :isActive="newThreadDialog"
      :threads="threads"
      @create="handleThreadDialogCreate"
      @cancel="handleThreadDialogCancel"
    />
  </div>
</template>
