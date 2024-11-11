<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import DashboardView from './views/loggedIn/DashboardView.vue';

const authStore = useAuthStore();

</script>

<template>
  <!-- <ThemeSwitcher /> -->
  <RouterView v-if="!authStore.authenticated" />
  <DashboardView v-else />
</template>