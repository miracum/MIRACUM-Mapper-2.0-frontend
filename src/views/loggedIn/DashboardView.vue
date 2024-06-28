<template>
  <div>
    <Header :buttons="headerButtons" />
    <div class="container-fluid">
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
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import ProjectTable from '@/components/ProjectTable.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();
const projectElements = ref([]);
const isLoading = ref(true);

const headerButtons = ref([
  { label: 'New Project', action: createNewProject, disabled: false },
  { label: 'Import Project', action: importProject, disabled: false },
  { label: 'Export Project', action: exportProject, disabled: true },
  { label: 'Logout', action: logoutAndNavigate, disabled: false }
]);

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

function fetchProjects() {
  fetch('http://localhost:8080/projects', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsibm9ybWFsIl19.rIcV697FIuYDvAm_tWgSEvBUWerzLbmheTsUHgE3zBPsobDE1EpO1ZJkg9_xvjMzayQXL-Sl7-5mGrh7tridNg'
    }
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(data => {
    console.log(data);
    projectElements.value = data;
    // sleep 3 seconds to simulate loading
    // setTimeout(() => {

    // }, 500);
    isLoading.value = false;
    // isLoading.value = false; // Set loading to false once data is loaded
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    // setTimeout(() => {

    // }, 500);
    isLoading.value = false;
  });
}

onMounted(() => {
  fetchProjects(); // Call fetchProjects when the component mounts
});
</script>

<style scoped>
/* .card {
  border: none;
} */
</style>