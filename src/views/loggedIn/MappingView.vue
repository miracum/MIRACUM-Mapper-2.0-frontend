<template>
  <div>
    <div class="container-fluid">
      <main role="main" class="pb-3">
        <template v-if="isLoading">
          <div class="card">
            <DataTable :value="loadingMappingPlaceholder">
              <Column v-for="i in 5" header="">
                <template #body>
                  <Skeleton></Skeleton>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
        <MappingList :mappings="mappingStore.mappings" :project="projectStore.currentProjectDetails"
          v-else-if="projectStore.currentProjectDetails && mappingStore.mappings" />
        <p v-else>There was an error with loading the projectdetails or mappings.</p>
      </main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue';
import { useMappingStore } from '@/stores/mappings';
import { useProjectStore } from '@/stores/project';
import MappingList from '@/components/mappingList/MappingList.vue';
import { useGetProjectDetailsQuery } from '@/composables/queries/project-query';
import { useGetMappingsQuery } from '@/composables/queries/mapping-query';

const loadingMappingPlaceholder = ref(new Array(4));
const route = useRoute();
const projectId = ref(route.params.projectId);
const projectStore = useProjectStore();
const mappingStore = useMappingStore();
const isLoading = ref(true);

onMounted(() => {
  if (!Array.isArray(projectId.value) && !isNaN(Number(projectId.value))) {
    const {
      state: projectDetailsState,
      isReady: projectDetailsIsReady,
      isFetching: projectDetailsIsFetching,
      error: projectDetailsError,
      execute: executeProjectDetailsQuery
    } = useGetProjectDetailsQuery(Number(projectId.value));

    const {
      state: mappingsState,
      isReady: mappingsIsReady,
      isFetching: mappingsIsFetching,
      error: mappingsError,
      execute: executeMappingsQuery
    } = useGetMappingsQuery(Number(projectId.value));

    executeProjectDetailsQuery();
    executeMappingsQuery();

    watch([projectDetailsIsFetching, mappingsIsFetching], ([newProjectFetching, newMappingsFetching]) => {
      if (!newProjectFetching && !newMappingsFetching) {
        isLoading.value = false;
        if (projectDetailsState.value && mappingsState.value) {
          projectStore.setCurrentProjectDetails(projectDetailsState.value);
          mappingStore.setMappings(mappingsState.value);
        }
      }
    }
    );
  } else {
    console.error('Project ID is not a number');
  }
});
</script>

<style scoped></style>