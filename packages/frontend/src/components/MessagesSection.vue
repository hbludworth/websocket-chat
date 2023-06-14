<script setup lang="ts">
import type { Thread } from 'types';
import { type PropType, computed } from 'vue';
import store from '@/store';

defineProps({
  thread: {
    type: Object as PropType<Thread>,
    required: true,
  },
});

const currentUser = computed(() => store.getters.user!);
</script>

<template>
  <div
    v-for="message in thread.messages"
    :key="message.uuid"
    :class="{
      'is-flex is-flex-direction-row-reverse':
        message.userUuid === currentUser.uuid,
    }"
  >
    <div
      class="box mb-2 comment-box px-3 py-3"
      :class="{
        'has-background-primary-light has-text-right':
          message.userUuid === currentUser.uuid,
      }"
    >
      <p>{{ message.content }}</p>
      <p class="has-text-primary is-size-7">
        {{ new Date(message.createdOn).toLocaleString() }}
      </p>
    </div>
  </div>
</template>
