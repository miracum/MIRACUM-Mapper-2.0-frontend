<template>
  <div>
    <div class="container-fluid">
      <main role="main" class="pb-3">
        <Panel>
          <template #header>
            <h1 class="text-2xl m-0">Concept Browser</h1>
          </template>
          <template v-if="isFetching.value">
            <DataTable :value="loadingPlaceholder">
              <Column v-for="_ in 4" :key="_" header="">
                <template #body>
                  <Skeleton></Skeleton>
                </template>
              </Column>
            </DataTable>
          </template>
          <Message v-else-if="error.value" class="mt-3" severity="error" :closable="false">{{ error.value.message }}</Message>
          <div v-else>
            <p>Here you can browse throught the concepts of the used codesystems of this project, that were added in each version.</p>
            <Select v-model="selectedRole" :options="codeSystemRoles" placeholder="Select Codesystem Role" class="mt-3">
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div class="flex items-center gap-2">
                    <RoleTag :value="slotProps.value.type" />
                    <span>
                      {{ slotProps.value.codeSystemName }}
                    </span>
                    <span v-if="slotProps.value.name">
                      ({{ slotProps.value.name }})
                    </span>
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <RoleTag :value="option.type" />
                  <span>
                    {{ option.codeSystemName }}
                  </span>
                  <span v-if="option.name">
                    ({{ option.name }})
                  </span>
                </div>
              </template>
            </Select>
            <Select v-model="selectedVersion" :options="versions" placeholder="Select Version" :disabled="!selectedRole" class="ms-3">
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <div class="flex items-center gap-2">
                    <Tag :value="slotProps.value.version_name" />
                    <span>
                      ({{ slotProps.value.release_date }})
                    </span>
                    <span v-if="selectedRole && selectedRole.versionId === slotProps.value.id">
                      [Current Version]
                    </span>
                    <span v-if="selectedRole && nextVersionId === slotProps.value.id">
                      [Next Version]
                    </span>
                  </div>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="{ option }">
                <div class="flex items-center gap-2">
                  <Tag :value="option.version_name" />
                  <span>
                    ({{ option.release_date }})
                  </span>
                  <span v-if="selectedRole && selectedRole.versionId === option.id">
                    [Current Version]
                  </span>
                  <span v-if="selectedRole && nextVersionId === option.id">
                    [Next Version]
                  </span>
                </div>
              </template>
            </Select>
            <div v-if="currentConcepts.length > 0" class="mt-3">
              <DataTable :value="currentConcepts" stripedRows dataKey="id"
                removableSort sortMode="multiple"
                v-model:filters="filters" filterDisplay="row" :globalFilterFields="globalFilterFields"
                responsiveLayout=" scroll"
                scrollable scroll-height="calc(100vh - 415px)"
                :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 20, 50, 100, 500, 1000, 5000]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} concepts">
                <Column header="Status" field="status" :showFilterMenu="false">
                  <template #body="{ data }">
                    <ConceptStatusTag :value="data.status" />
                  </template>
                  <template #filter="{ filterModel, filterCallback }">
                    <ConceptStatusMultiSelect v-model="filterModel.value" @change="filterCallback()" />
                  </template>
                </Column>
                <Column header="Code" field="code" sortable>
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search" style="width: 100px;" />
                  </template>
                </Column>
                <Column header="Meaning" field="meaning" sortable>
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search" />
                  </template>
                </Column>
                <Column header="Description" field="description" sortable :style="{'width': '35%'}">
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Search" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </Panel>
      </main>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch, type Ref, nextTick } from 'vue';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import RoleTag from '@/components/tags/RoleTag.vue';
import { useProjectStore } from '@/stores/project';
import { useAuthStore } from '@/stores/auth';
import { useCodeSystemStore, type GetCodeSystemVersion, type CodeSystemVersionWithConcepts, type Concept } from '@/stores/codesystem';
import { useGetAllNewConceptsQuery } from '@/composables/queries/codesystem-query';
import { useGetProjectDetailsQuery } from '@/composables/queries/project-query';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const codeSystemStore = useCodeSystemStore();
const loadingPlaceholder = ref(new Array(4));

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
});

try {
    Number(props.projectId);
} catch (e) {
    router.push('/projects');
}
const projectId = Number(props.projectId);

const { state, isFetching: projectIsFetching, error: projectError, execute } = useGetProjectDetailsQuery(projectId);
watch(projectIsFetching, (newValue) => {
  if (!newValue) {
    if (!error.value) {
      if (state.value) {
        projectStore.setCurrentProjectDetails(state.value);
        if (state.value.project_permissions) {
          for (const role of state.value.project_permissions) {
            if (role.user.id === authStore.userInfo?.id) {
              projectStore.setProjectRole(role.role);
              break;
            }
          }
        }
      } else {
        router.push('/projects');
      }
    }
  }
});
execute();

const { isFetching: codeSystemIsFetching, error: codeSystemError } = codeSystemStore.refreshState()

const isFetching = computed(() => projectIsFetching || codeSystemIsFetching);
const error = computed(() => projectError || codeSystemError);

const project = ref(projectStore.currentProjectDetails);

const selectedRole = ref();
const codeSystemRoles = computed(() => {
  return project.value?.code_system_roles.map(role => ({
    codeSystemId: role.system.id,
    codeSystemName: role.system.name,
    versionId: role.system.version.id,
    type: role.type,
    name: role.name,
    roleId: role.id, // just for reference
  })) || [];
});

const selectedVersion = ref();
const versions = ref<GetCodeSystemVersion[]>([]);
watch(selectedRole, (newRole) => {
  selectedVersion.value = undefined;
  currentConcepts.value = [];
  if (newRole) {
    versions.value = codeSystemStore.getVersions(newRole.codeSystemId).value
  } else {
    versions.value = [];
  }
});
watch(selectedVersion, (newVersion) => {
  if (newVersion && selectedRole.value) {
    if (concepts[selectedRole.value.codeSystemId] === undefined) {
      toast.add({ severity: 'info', summary: 'Loading Concepts', detail: `Loading concepts for ${selectedRole.value.codeSystemName}...`, life: 3000 });
      const { state: conceptsState, isFetching: conceptsIsFetching, error: conceptsError, execute: executeConceptsQuery } = useGetAllNewConceptsQuery(selectedRole.value.codeSystemId);
      watch(conceptsIsFetching, (newValue) => {
        if (!newValue) {
          if (!conceptsError.value) {
            concepts[selectedRole.value.codeSystemId] = conceptsState.value;
            setCurrentConcepts(selectedRole.value.codeSystemId, newVersion.id);
            toast.add({ severity: 'success', summary: 'Concepts Loaded', detail: `Loaded concepts for ${selectedRole.value.codeSystemName}`, life: 3000 });
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: `Could not fetch concepts due to a server error: ${conceptsError.value?.message ? JSON.stringify(conceptsError.value.message) : 'Unknown error'}`, life: 10000 });
          }
        }
      });
      executeConceptsQuery();
    } else {
      setCurrentConcepts(selectedRole.value.codeSystemId, newVersion.id);
    }
  }
});

const concepts: Record<number, CodeSystemVersionWithConcepts[]> = {}
let currentConcepts: Ref<Concept[]> = ref([]);

const setCurrentConcepts = (codeSystemId: number, versionId: number) => {
  if (concepts[codeSystemId]) {
    for (const version of concepts[codeSystemId]) {
      if (version.id === versionId) {
        currentConcepts.value = version.concepts;
        break;
      }
    }
  }
};

// Query parameters for the initial selection of role and version (only if called during migration)
const query = route.query;
let nextVersionId = 0;

if (query.role_id && query.version_id) {
  try {
    Number(query.role_id);
    Number(query.version_id);
  } catch (e) {
    // do nothing
  }
  const roleId = Number(query.role_id);
  const versionId = Number(query.version_id);
  nextVersionId = versionId;
  const role = codeSystemRoles.value.find(r => r.roleId === roleId);
  if (role) {
    selectedRole.value = role;
    nextTick(() => {
      const version = versions.value.find(v => v.id === versionId);
      if (version) {
        selectedVersion.value = version;

      }
    });
  }
}

// filters for the DataTable
const filters = ref({
  status: { value: null, matchMode: 'in' },
  code: { value: null, matchMode: 'contains' },
  meaning: { value: null, matchMode: 'contains' },
  description: { value: null, matchMode: 'contains' }
});

const globalFilterFields: string[] = [
  'status',
  'code',
  'meaning',
  'description',
];

</script>
