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

<script>
// import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import DataTable from '@/components/DataTable.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import ProjectTable from '@/components/ProjectTable.vue';

// async function fetchData() {
//     const response = await fetch('http://localhost:8083/projects');
//     return await response.json();
// }

export default {
  components: {
    DataTable,
    Header,
    Footer,
    ProjectTable
  },
  methods: {
    createNewProject() {
      // Implementation
    },
    importProject() {
      // Implementation
    },
    exportProject() {
      // Implementation
    },
    logoutAndNavigate() {
      const authStore = useAuthStore();
      authStore.setAuthStatus(false); // Assuming this method logs the user out
      this.$router.push('/'); // Navigate to the landing page
    },
    fetchProjects() {
      fetch('http://localhost:8080/projects', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsibm9ybWFsIl19.CDrSU69Aeffi6nm3u5RXIIDlSjr5__Gt3wtHvNw6LLF1qN8ewugfL3h44aBiN4UnwFOGcFf3DItHlZVW0XJQzg'
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        console.log(data);
        this.projectElements = data;
        // sleep 3 seconds to simulate loading
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        // this.isLoading = false; // Set loading to false once data is loaded
      }).catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    }
  },
  mounted() {
    this.fetchProjects(); // Call fetchProjects when the component mounts
  },
  data() {
    return {
      headerButtons: [
        { label: 'New Project', action: this.createNewProject, disabled: false },
        { label: 'Import Project', action: this.importProject, disabled: false },
        { label: 'Export Project', action: this.exportProject, disabled: true },
        { label: 'Logout', action: this.logoutAndNavigate, disabled: false }
      ],
      projectElements: [],
      isLoading: true
    };
  },
  // Component logic here
}
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