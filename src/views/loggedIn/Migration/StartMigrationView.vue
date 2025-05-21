<template>
    <div class="grid-container-one">
        <Panel class="grid-item">
            <template #header>
                <h1 class="text-2xl m-0">Start Migration</h1>
            </template>
            <div class="mb-3">For each source and target code system, the available newer versions are shown here. You can select a version to migrate to.</div>

            <DataTable v-if="isFetching" :value="loadingPlaceholder">
                <Column v-for="_ in 5" :key="_" header="">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
            </DataTable>

            <Message v-else-if="error" class="mt-3" severity="error" :closable="false">{{ error.message }}</Message>

            <DataTable v-else-if="migrationOptions" v-for="role in migrationOptions.code_system_roles" :key="role.id" :value="role.system.newer_versions" stripedRows removableSort>
                <template #header>
                    <div style="display: flex; gap: 10px;">
                        <RoleTag :value="role.type" />
                        <span>Codesystem: {{ role.system.name }}</span>
                        <span v-if="role.name">Name: {{ role.name }}</span>
                        <span>Current Version: {{ role.system.version.version_name }} ({{ role.system.version.release_date }})</span>
                    </div>
                </template>
                <template #empty>
                    No newer versions available
                </template>
                <Column field="version_name" header="Version Name"></Column>
                <Column field="release_date" header="Release Date">
                </Column>
                <Column field="imported" header="Imported">
                    <template #body="slotProps">
                        <span v-if="slotProps.data.imported">Yes</span>
                        <span v-else>No</span>
                    </template>
                </Column>
                <Column class="w-24">
                <template #body="{ data }">
                    <Button @click="migrate(role, data)" severity="success" rounded>Migrate</Button>
                </template>
            </Column>
            </DataTable>
        </Panel>
    </div>
    <div class="button-container">
        <Button label="Cancel" severity="danger" @click="onCancel" />
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useGetMigrationOptionsQuery, useStartMigrationQuery, type MigrationOptions, type CodeSystemRoleMigration } from '@/composables/queries/project-migration-query';
import type { GetCodeSystemVersion } from '@/stores/codesystem';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
});

const router = useRouter();
const toast = useToast();

const loadingPlaceholder = ref(new Array(4));

try {
    Number(props.projectId);
} catch (e) {
    router.push('/projects');
}
const projectId = Number(props.projectId);

const migrationOptions = ref<MigrationOptions | null>(null);

const { isFetching, state, error, execute } = useGetMigrationOptionsQuery(projectId);
watch(isFetching, (newVal) => {
    if (!newVal && !error.value) {
        migrationOptions.value = state.value;
    }
});
execute();

const migrate = (role: CodeSystemRoleMigration, version: GetCodeSystemVersion) => {
    const { isFetching, error, execute } = useStartMigrationQuery(projectId, role.id, version.id);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (error.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.value.message, life: 10000 });
            } else {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Migration started successfully', life: 10000});
                router.push(`/projects/${projectId}`);
            }
        }
    });
    execute();
};

const onCancel = () => {
    router.push(`/projects/${projectId}`);
};

</script>

<style scoped>

.grid-container-one {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

</style>