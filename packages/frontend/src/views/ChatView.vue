<script setup lang="ts">
import serverProxy from '@/serverProxy';
import type { Thread, WebSocketPayload } from 'types';
import { onMounted, ref } from 'vue';
import store from '@/store';

const threads = ref<Thread[]>([]);
const socket = ref<WebSocket>();

const selectedThread = ref<Thread>();

onMounted(async () => {
  try {
    threads.value = await serverProxy.getUserThreads();
    socket.value = store.getters.socket!;

    setupSocketListener();
  } catch (err) {
    console.error(err);
  }
});

const setupSocketListener = () => {
  socket.value!.onmessage = async (event) => {
    const message: WebSocketPayload = JSON.parse(await event.data.text());

    switch (message.type) {
      case 'newThread': {
        threads.value.push(message.body);
        break;
      }
      case 'newMessage': {
        const thread = threads.value.find(
          (thread) => thread.uuid === message.body.threadUuid
        );
        if (thread) {
          thread.messages.push(message.body);
        }
        break;
      }
    }
  };
};
</script>

<template>
  <section class="section has-text-centered is-large">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-one-fifth">
          <h1
            v-for="thread in threads"
            :key="thread.uuid"
            @click="selectedThread = thread"
          >
            {{ thread.uuid }}
          </h1>
        </div>
        <div class="column is-four-fifths">
          <div v-if="selectedThread">
            <p v-for="message in selectedThread.messages">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
