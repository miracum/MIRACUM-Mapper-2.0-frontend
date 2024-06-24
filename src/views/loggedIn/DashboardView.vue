<template>
  <div>
    <Header :buttons="headerButtons" />
    <div class="container-fluid">
      <main role="main" class="pb-3">
        <div class="container-fluid h-100 d-flex flex-column justify-content-center align-items-center card mb-5">

          <div class="container-fluid dashboard">
            <div class="row justify-content-center align-items-center">
              <!-- Loading Spinner -->
              <div id="loadingOverlay" v-if="isLoading">
                <div>
                  <p>Data is being loaded...</p>
                  <div class="spinner"></div>
                </div>
              </div>
              <!-- Main Content -->
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
import { useAuthStore } from '@/stores/auth';
import DataTable from '@/components/DataTable.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ProjectTable from '@/components/ProjectTable.vue';

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
  authStore.setAuthStatus(false); // Assuming this method logs the user out
  this.$router.push('/'); // Navigate to the landing page
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
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
    // isLoading.value = false; // Set loading to false once data is loaded
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  });
}

onMounted(() => {
  fetchProjects(); // Call fetchProjects when the component mounts
});
</script>

<style scoped>
@import '@/assets/miracum-mapper-old.css';

#loadingOverlay {
  display: flex;
  justify-content: center;
  /* Center horizontally */
  align-items: center;
  /* Center vertically */
  height: 100%;
  /* Take full height of the parent */
  width: 100%;
  /* Take full width of the parent */
}
</style>