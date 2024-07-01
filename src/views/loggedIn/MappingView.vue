<template>
    <div>
        <Header :buttons="headerButtons" />
        <div class="container-fluid">
            <main role="main" class="pb-3">
                <LoadingSpinner v-if="isLoading" />
                <MappingTable :mappings="mappings" :project="project" v-else/>
            </main>
        </div>
        <Footer />
    </div>
</template>

<script setup>
// import EditProjectModal from './EditProjectModal.vue'; //only show modal buttons when hovering over the row
// import ConfirmDeleteModal from './ConfirmDeleteModal.vue'; //only show modal buttons when hovering over the row
// import CreateMappingModal from './CreateMappingModal.vue'; //only show modal buttons when hovering over the row
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MappingTable from '@/components/MappingTable.vue';
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';


const route = useRoute();
const router = useRouter();
const projectId = ref(parseInt(route.params.projectId, 10));
const mappings = ref([]);
const project = ref(null);
const isLoading = ref(true);
const authStore = useAuthStore();


const headerButtons = ref([
  { label: 'New Mapping', action: createNewMapping, disabled: false },
  { label: 'Logout', action: logoutAndNavigate, disabled: false }
]);

function logoutAndNavigate() {
  authStore.logout();
  router.push('/');
}

function createNewMapping() {
  router.push(`/projects/${projectId.value}/mappings/new`);
}

function fetchProjectMappings(projectId) {
  fetch(`http://localhost:8080/projects/${projectId}/mappings?sortBy=id&sortOrder=asc`, {
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
    mappings.value = data;

    isLoading.value = false;
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    isLoading.value = false;
  });
}

function fetchProjectDetails(projectId) {
  fetch(`http://localhost:8080/projects/${projectId}`, {
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
    project.value = data;
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
}

onMounted(() => {
    if (projectId.value) {
        fetchProjectDetails(projectId.value);
        fetchProjectMappings(projectId.value);
    }
});
</script>

<style scoped></style>