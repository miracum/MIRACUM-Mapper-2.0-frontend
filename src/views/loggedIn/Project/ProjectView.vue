<template>
    <EditProjectDialog v-model:visible="visible" />

    <Panel>
        <template #header>
            <div class="header">
                <h1 class="title">Mapping Table</h1>
                <!-- <h2 class="subtitle">Create a new Mapping Project</h2> -->
            </div>
        </template>
        <!-- Loading State TODO Better align skeletons -->
        <div v-if="isFetching" v-for="i in 4" :key="i" class="card-spacing" style="margin-bottom: 1rem;">
            <Card class="card">
                <template #title>
                    <Skeleton class="w-10rem border-round h-2rem" />
                </template>
                <template #subtitle>
                    <Skeleton class="w-8rem border-round h-1rem" />
                </template>
                <template #content>
                    <div class="card-content">
                        <Skeleton class="w-8rem border-round h-1rem" />
                        <div class="card-actions">
                            <Skeleton class="w-4rem border-round h-2rem" />
                            <Skeleton class="w-4rem border-round h-2rem" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Error State -->
        <Message v-if="error" severity="danger" :closable="false">{{ error.message }}</Message>

        <!-- Data View -->
        <ProjectListView v-else-if="projects != undefined && projects!.length > 0" :data="projects" :onEdit="onEdit"
            :onDelete="onDelete" />

        <!-- No Projects Found -->
        <!-- <Message v-else severity="error">Currently, there are no projects available.</Message> -->
        <Message v-else severity="warn" :closable="false">Currently, there are no projects available. Create one by
            clicking
            on Add Project.</Message>
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
                        console.log(error.value?.message.toString());
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

<style>
.card {
    background-color: #eff0f1;
    /* Blue Grey background color */
}

.card-spacing {
    margin-bottom: 1rem;
    /* Adjust the spacing as needed */
    position: relative;
    /* Ensure the hover effect is contained within the card */
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-actions {
    display: flex;
    gap: 10px;
    /* Adjust the gap between buttons as needed */
    opacity: 0;
    /* Initially hide the buttons */
    transition: opacity 0.3s ease;
    /* Smooth transition for the opacity change */
}

.card-spacing:hover .card-actions {
    opacity: 1;
    /* Show the buttons when the card is hovered */
}

.confirm-button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>