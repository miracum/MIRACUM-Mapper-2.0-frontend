<template>
  <div>
    <div class="container-fluid">
      <main role="main" class="pb-3">
        <Panel>
          <template #header>
            <div class="header">
              <h1 class="title">Mapping Table</h1>
              <!-- <h2 class="subtitle">Create a new Mapping Project</h2> -->
            </div>
          </template>
          <!-- <template #icons v-if="projectStore.currentProjectDetails && mappingStore.mappings">
            <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
          </template> -->
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
            v-else-if="projectStore.currentProjectDetails && mappingStore.mappings" ref="mappingList" />
          <p v-else>The backend cannot be reached. Please make sure that it is available.</p>
        </Panel>
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

// const mappingListRef = ref<InstanceType<typeof MappingList> | null>(null);

// const exportCSV = () => {
//   if (mappingListRef.value) {
//     mappingListRef.value.exportCSV();
//   }
// };

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

<style scoped>
.title {
  font-size: 24px;
  margin: 0;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}
</style>