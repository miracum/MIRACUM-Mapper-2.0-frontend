<template>
  <div>
    <div class="container-fluid">
      <main role="main" class="pb-3">
        <Panel>
          <template #header>
            <h1 class="text-2xl m-0">Mapping Table</h1>
          </template>
          <template #icons v-if="projectStore.currentProjectDetails && mappingStore.mappings">
            <div class="flex space-x-2">
              <!-- <Button text @click="permissionRoleDialog = true">
                <PermissionTag :value="projectStore.projectRole" v-if="projectStore.projectRole" />
              </Button> -->
              <Button icon="pi pi-pencil" label="Edit project" @click="editProjectView(projectId)"
                :disabled="!userHasPermission(ProjectUpdatePermission, projectStore, authStore)"
                v-tooltip.top="addDisablePermissionTooltip(ProjectUpdatePermission)" />
              <!-- <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" /> -->
            </div>
          </template>
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
          <!-- @set-datatable-ref="setDatatableRef" -->
          <p v-else>The backend cannot be reached. Please make sure that it is available.</p>
          <!-- wrong error message, if user doesn't has the right permissions, this should be shown here as well-->
          <!-- <PermissionRoleDialog v-model:visible="permissionRoleDialog" :role="projectStore.projectRole" /> -->
        </Panel>
      </main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
import { ref, onMounted, watch, type Ref } from 'vue';
import { useMappingStore } from '@/stores/mappings';
import { useProjectStore, type ProjectRole } from '@/stores/project';
import MappingList from '@/components/mappingList/MappingList.vue';
import { useGetProjectDetailsQuery } from '@/composables/queries/project-query';
import { useGetMappingsQuery } from '@/composables/queries/mapping-query';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { userHasPermission, ProjectUpdatePermission, getPermissionTooltip } from '@/lib/permissions';

const loadingMappingPlaceholder = ref(new Array(4));
const route = useRoute();
const projectId = ref(route.params.projectId);
const projectStore = useProjectStore();
const mappingStore = useMappingStore();
const authStore = useAuthStore();
const isLoading = ref(true);

const addDisablePermissionTooltip = (permission: ProjectRole[]) => {
  return getPermissionTooltip(permission, projectStore, authStore);
};

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
          if (projectDetailsState.value.project_permissions) {
            for (const role of projectDetailsState.value.project_permissions) {
              if (role.user.id === authStore.userInfo?.id) {
                projectStore.setProjectRole(role.role);
                break;
              }
            }
          }

        }
      }
    }
    );
  } else {
    console.error('Project ID is not a number');
  }
});

const editProjectView = (projectId: string | string[]) => {
  router.push(`/dashboard/projects/${projectId}/edit`);
};

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