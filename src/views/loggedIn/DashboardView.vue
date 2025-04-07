<template>
  <MenuHeader />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="padding-all">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import MenuHeader from '@/components/shared/MenuHeader.vue';
import ConfirmDialog from 'primevue/confirmdialog';


</script>

<style scoped>
.padding-all {
  padding: 10px;
}
</style>