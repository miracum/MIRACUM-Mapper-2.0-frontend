<template>
    <div v-if="isFetching" class="grid-container-one">
        <Panel class="grid-item">
            <DataTable :value="loadingPlaceholder">
                <Column v-for="_ in 5" :key="_" header="">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
            </DataTable>
        </Panel>
    </div>
    <div v-else-if="error" class="grid-container-one">
        <Panel class="grid-item">
            <Message class="mt-3" severity="error" :closable="false">{{ error.message }}</Message>
        </Panel>
    </div>
    <MappingView v-else-if="migrationStatus && !migrationStatus.running" />
    <MigrationView v-else-if="migrationStatus" :projectId="projectId" :migrationStatus="migrationStatus" />
</template>

<script setup lang="ts">
import MigrationView from '@/views/loggedIn/Migration/MigrationView.vue';
import MappingView from '@/views/loggedIn/MappingView.vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGetMigrationStatusQuery, type MigrationStatus, } from '@/composables/queries/project-migration-query';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
});

const router = useRouter();

const loadingPlaceholder = ref(new Array(4));

try {
    Number(props.projectId);
} catch (e) {
    router.push('/projects');
}
const projectId = Number(props.projectId);

const migrationStatus = ref<MigrationStatus | null>(null);
const { isFetching, state, error, execute } = useGetMigrationStatusQuery(projectId);
watch(isFetching, (newVal) => {
    if (!newVal && !error.value) {
        migrationStatus.value = state.value;
    }
});
execute();

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