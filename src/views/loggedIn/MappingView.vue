<template>
    <div>
        <Header :buttons="headerButtons" />
        <div class="container-fluid">
            <main role="main" class="pb-3">
                <LoadingSpinner v-if="isLoading" />
                <!-- <MappingTable :mappings="mappings" :project="project" v-else/> -->
                <!-- <DataTableMapping></DataTableMapping> -->
                    <!-- <MappingTable :mappings="mappingStore.mappings" :project="projectStore.currentProjectDetails" v-if="projectStore.currentProjectDetails && mappingStore.mappings"/> -->
                    <!-- <DataTableMapping :mappings="mappingStore.mappings" :project="projectStore.currentProjectDetails" v-else/> -->
                 <MappingList :mappings="mappingStore.mappings" :project="projectStore.currentProjectDetails" v-else-if="projectStore.currentProjectDetails && mappingStore.mappings"/>
                 <p v-else>There was an error with loading the projectdetails or mappings.</p>

            </main>
        </div>
        <Footer />
    </div>
</template>

<script setup lang='ts'>
// import EditProjectModal from './EditProjectModal.vue'; //only show modal buttons when hovering over the row
// import ConfirmDeleteModal from './ConfirmDeleteModal.vue'; //only show modal buttons when hovering over the row
// import CreateMappingModal from './CreateMappingModal.vue'; //only show modal buttons when hovering over the row
// import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useMappingStore } from '@/stores/mappings';
import { useProjectStore } from '@/stores/project';
import MappingTable from '@/components/MappingTable.vue';
import DataTableMapping from '@/components/DataTableMapping.vue';
import Header from '@/components/shared/Header.vue';
import Footer from '@/components/shared/Footer.vue';
import MappingList from '@/components/shared/MappingList.vue';


const route = useRoute();
const router = useRouter();
const projectId = ref(route.params.projectId);
//const mappings = ref([]);
//const project = ref(null);
const isLoading = ref(true);
const authStore = useAuthStore();
const projectStore = useProjectStore();
const mappingStore = useMappingStore();


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

function fetchProjectMappingsandDetails(projectId: number | string) {
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
    mappingStore.setMappings(data);

    isLoading.value = false;
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
    isLoading.value = false;
  });
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
    projectStore.setCurrentProjectDetails(data);
  }).catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
}

onMounted(() => {
    if (!Array.isArray(projectId.value)) {
        fetchProjectMappingsandDetails(projectId.value);
        console.log(projectStore.currentProjectDetails);
        console.log(mappingStore.mappings);
    } else {
        console.error('Project ID is not a number');
    }
});
</script>

<style scoped></style>