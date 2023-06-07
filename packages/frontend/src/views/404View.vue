<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <section class="section has-text-centered is-medium">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            Not Found
          </h1>
          <h2 class="subtitle is-size-4-desktop">
            The resource you tried to access either does not exist or has been
            moved.
          </h2>

          <h2 v-if="message" class="subtitle is-size-4-desktop">
            {{ message }}
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>
