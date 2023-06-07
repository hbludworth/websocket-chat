<script setup lang="ts"></script>

<template>
  <section class="section has-text-centered is-medium">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-three-fifths">
          <span class="icon mb-6">
            <i class="mdi mdi-48px mdi-check-circle has-text-success"></i>
          </span>
          <h1
            class="title is-spaced is-size-1-desktop is-size-2-mobile has-text-primary"
          >
            Authenticated Page
          </h1>
          <h2 class="subtitle">
            This page only appears for authenticated users. Otherwise, the page
            is redirected to a 401 Unauthorized page.
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>
