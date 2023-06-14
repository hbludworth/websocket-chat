<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import FooterBar from '@/components/FooterBar.vue';
import router from '@/router';
import { computed } from 'vue';

const currentRoute = computed(() => router.currentRoute.value);
</script>

<template>
  <NavBar />

  <main>
    <RouterView />
  </main>

  <FooterBar v-if="currentRoute.path !== '/chats'" />
</template>
