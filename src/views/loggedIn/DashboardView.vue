<template>
  <MenuHeader :items="menuItems" />
  <Navigator />
  <div class="padding-all">
    <!-- <Header :buttons="headerButtons" /> -->


    <ProjectList :elements="state" :loading="isFetching" />
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
import { ref, onMounted, watch } from 'vue';
import { NavigationFailureType, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProjectStore } from '@/stores/project';
// import Header from '@/components/shared/Header.vue';
// import Footer from '@/components/shared/Footer.vue';
// import ProjectTable from '@/components/ProjectTable.vue';
// import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import MenuHeader from '@/components/shared/MenuHeader.vue';
import Navigator from '@/components/shared/Navigator.vue';
import ProjectList from '@/components/shared/ProjectList.vue';
// import DataTableMapping from '@/components/DataTableMapping.vue';
import { useProjectQuery } from '@/composables/queries/project-query';

const router = useRouter();
const authStore = useAuthStore();
// const projectElements = ref([]);
const isLoading = ref(true);
const store = useProjectStore();

const menuItems = ref([
  // {
  //   label: 'Home',
  //   icon: 'pi pi-home'
  // },
  {
    label: 'Add Project',
    icon: 'pi pi-plus'
  },
  {
    label: 'Import Project',
    icon: 'pi pi-file-import'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    items: [
      // {
      //     separator: true
      // },
      {
        label: 'Theme',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'System',
            icon: 'pi pi-bolt',
            id: 'system'
          },
          {
            label: 'Light',
            icon: 'pi pi-sun',
            id: 'light'
          },
          {
            label: 'Dark',
            icon: 'pi pi-moon',
            id: 'dark'
          },
        ]
      }
    ]
  },
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out ',
    command: logoutAndNavigate
  }
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

const { error, isFetching, isReady, state, execute } = useProjectQuery({
  params: {
    query: {
    },
  },
});


// function fetchProjects() {
//   fetch('http://localhost:8080/projects', {
//     method: 'GET',
//     headers: {
//       'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsibm9ybWFsIl19.rIcV697FIuYDvAm_tWgSEvBUWerzLbmheTsUHgE3zBPsobDE1EpO1ZJkg9_xvjMzayQXL-Sl7-5mGrh7tridNg'
//     }
//   }).then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   }).then(data => {
//     console.log(data);

//     // sleep 3 seconds to simulate loading
//     isLoading.value = false;

//     store.setProjects(data);
//     // projectElements.value = data;

//     // isLoading.value = false; // Set loading to false once data is loaded
//   }).catch(error => {
//     console.error('There was a problem with your fetch operation:', error);
//     // setTimeout(() => {

//     // }, 500);
//     isLoading.value = false;
//   });
// }

onMounted(() => {
  execute();
  watch(state, (newState) => {
    if (newState && !error.value) {
      store.setProjects(newState);
    }
  });
});
</script>

<style scoped>
.padding-all {
  padding: 10px;
  /* Adjust the value as needed */
}
</style>