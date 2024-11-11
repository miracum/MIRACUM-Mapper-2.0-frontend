<template>
    <EditProjectDialog v-model:visible="visible" />

    <Panel header="Project Overview">
        <!-- Error State -->
        <Message v-if="error" severity="danger" :closable="false">{{ error.message }}</Message>

        <!-- Data View -->
        <ProjectListView :loading="isFetching" :data="projects" :onEdit="onEdit" :onDelete="onDelete" />
    </Panel>

</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed, onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';
import { ref, watch } from "vue";
import { useProjectQuery, useDeleteProjectQuery } from '@/composables/queries/project-query';
import EditProjectDialog from "./EditProjectDialog.vue";
import ProjectListView from "./ProjectListView.vue";

// const addProject = () => {
//     router.push('/dashboard/projects/add');
// };

const store = useProjectStore();

const confirm = useConfirm();
const toast = useToast();

const visible = ref(false);

onMounted(() => {
    watch(state, (newState) => {
        if (newState && !error.value) {
            store.setProjects(newState);
        }
    });
    execute();
});

const { error, isFetching, isReady, state, execute } = useProjectQuery({
    params: {
        query: {
        },
    },
});

// A computed property is used here to get the projects from the store. This is because the store is reactive and the computed property will update when the store updates.
const projects = computed(() => store.projects);

const onDelete = (id: number, name: string) => {
    confirm.require({
        message: 'Are you sure you want to Delete the Project ' + name + '?',
        header: 'Delete Project',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            const { state, isReady, isFetching, error, execute } = useDeleteProjectQuery(id);
            watch(isFetching, (newVal) => {
                if (!newVal) {
                    if (isReady.value) {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Project successfully deleted', life: 10000 });
                        store.deleteProject(id);
                    } else {
                        // TODO this is a bad error message. Define error codes in the backend and translate them to meaningful ui errors. E.g. if the user isnt in the right scope, provide a unsufficient user permissions error instead of the current api error
                        toast.add({ severity: 'error', summary: 'Error', detail: `Could not delete Project due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                    }
                }
            });
            execute();
        },
    });
};

const onEdit = (id: number) => {
    store.setCurrentProject(id);
    visible.value = true;
};

</script>

<style scoped>
.card {
    background-color: #eff0f1;
}

.card-spacing {
    margin-bottom: 1rem;
    margin-top: 1rem;
    position: relative;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-actions {
    display: flex;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-spacing:hover .card-actions {
    opacity: 1;
}

.confirm-button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>