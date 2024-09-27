<template>
  <MenuHeader :items="menuItems" />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="padding-all">
    <!-- <Header :buttons="headerButtons" /> -->
    <!-- <ThemeSwitcher /> -->
    <RouterView />
    <!-- <ProjectList /> -->
    <!-- <DataTableMapping /> -->
    <!-- <div class="container-fluid">
      <main role="main" class="pb-3">
        <div class="container-fluid h-100 d-flex flex-column justify-content-center align-items-center mb-5">
          <div class="container-fluid dashboard">
            <div class="row justify-content-center align-items-center">
              <LoadingSpinner v-if="isLoading" />
              <ProjectTable :elements="projectElements" v-else />
            </div>
          </div>
        </div>
      </main>
    </div> -->
    <!-- <Footer /> -->
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { NavigationFailureType, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProjectStore } from '@/stores/project';
import Toast from 'primevue/toast';
import MenuHeader from '@/components/shared/MenuHeader.vue';
// import Navigator from '@/components/shared/Navigator.vue';
// import ProjectList from '@/views/loggedIn/Project/ProjectView.vue';
import ConfirmDialog from 'primevue/confirmdialog';
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(true);
const store = useProjectStore();

const menuItems = ref([
  // {
  //   label: 'Home',
  //   icon: 'pi pi-home'
  // },
  // {
  //   label: 'Add Project',
  //   icon: 'pi pi-plus'
  // },
  // {
  //   label: 'Import Project',
  //   icon: 'pi pi-file-import'
  // },
  // {
  //   label: 'Settings',
  //   icon: 'pi pi-cog',
  //   items: [
  //     // {
  //     //     separator: true
  //     // },
  //     {
  //       label: 'Theme',
  //       icon: 'pi pi-palette',
  //       items: [
  //         {
  //           label: 'System',
  //           icon: 'pi pi-bolt',
  //           id: 'system'
  //         },
  //         {
  //           label: 'Light',
  //           icon: 'pi pi-sun',
  //           id: 'light'
  //         },
  //         {
  //           label: 'Dark',
  //           icon: 'pi pi-moon',
  //           id: 'dark'
  //         },
  //       ]
  //     }
  //   ]
  // },
  // {
  //   label: 'Sign Out',
  //   icon: 'pi pi-sign-out ',
  //   command: logoutAndNavigate
  // }
]);

// const headerButtons = ref([
//   { label: 'New Project', action: createNewProject, disabled: false },
//   { label: 'Import Project', action: importProject, disabled: false },
//   { label: 'Export Project', action: exportProject, disabled: true },
//   { label: 'Logout', action: logoutAndNavigate, disabled: false }
// ]);

function createNewProject() {
  // Implementation
}

function importProject() {
  // Implementation
}

function exportProject() {
  // Implementation
}

function logoutAndNavigate() {
  authStore.logout();
  router.push('/');
}

</script>

<style scoped>
.padding-all {
  padding: 10px;
}
</style>