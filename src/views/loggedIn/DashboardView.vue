<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <MenuHeader class="m-2" />
  <Navigator class="m-2" />
  <div class="m-2">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { RouterView } from 'vue-router';
import MenuHeader from '@/components/shared/MenuHeader.vue';
import Navigator from '@/components/shared/Navigator.vue';
</script>