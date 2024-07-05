<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '30rem' }">
        <span class="p-text-secondary block mb-5">Update your information.</span>
        <div class="flex-row">
            <FloatLabel class="flex-item">
                <InputText id="name" v-model="project.name" />
                <label for="name">Name</label>
            </FloatLabel>
            <FloatLabel class="flex-item">
                <InputText id="version" v-model="project.version" />
                <label for="version">Version</label>
            </FloatLabel>
        </div>
        <FloatLabel>
            <Textarea v-model="project.description" rows="5" cols="30" />
            <label for="description">Description</label>
        </FloatLabel>
        <div class="confirm-button-group">
            <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
            <Button type="button" label="Save" @click="updateProject"></Button>
        </div>
    </Dialog>
    <!-- Loading State TODO Better align skeletons -->
    <div v-if="props.loading" v-for="i in 4" :key="i" class="card-spacing" style="margin-bottom: 1rem;">
        <Card>
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
    <Message v-if="props.error" severity="danger" :closable="false">{{ props.error.message }}</Message>

    <!-- Data View -->
    <DataView v-else-if="props.elements != undefined && props.elements!.length > 0" :value="props.elements" paginator
        :rows="5">
        <template #list="slotProps">
            <div v-for="(project, index) in slotProps.items" :key="index" class="card-spacing"
                style="margin-bottom: 1rem;">
                <Card>
                    <template #title>{{ project.name }}</template>
                    <template #subtitle>{{ project.version }}</template>
                    <template #content>
                        <div class="card-content">
                            <p class="m-0">{{ project.description }}</p>
                            <div class="card-actions">
                                <!-- PrimeVue Edit button -->
                                <Button label="Edit" icon="pi pi-pencil" @click="onEdit(project.id)" outlined></Button>
                                <!-- PrimeVue Delete button -->
                                <Button label="Delete" icon="pi pi-trash" @click="onDelete(project.id, project.name)"
                                    severity="danger" outlined></Button>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </template>
    </DataView>

    <!-- No Projects Found -->
    <!-- <Message v-else severity="error">Currently, there are no projects available.</Message> -->
    <Message v-else severity="warn" :closable="false">Currently, there are no projects available. Create one by clicking
        on Add Project.</Message>

</template>

<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed } from 'vue';
import { useProjectStore } from '@/stores/project';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { ref, watch } from "vue";
import type { ProjectResponse, AppError } from '@/composables/queries/project-query';
import EditProjectDialog from '../../views/loggedIn/Project/EditProjectDialog.vue';
import { useDeleteProjectQuery, usePutProjectQuery } from '@/composables/queries/project-query';
import type { Project } from '@/stores/project';

const visible = ref(false);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
    elements: {
        type: Object as () => ProjectResponse,
    },
    error: {
        type: Object as () => AppError,
    },
    loading: Boolean // Add this line
});

const store = useProjectStore();
// store.setProjects(props.elements);

let project = ref({ ...store.currentProject as Project });
// let project: any;

// const elementToEdit = computed(() => store.currentProject);

// function openEditModal(id) {
//     console.log('Opening edit modal for project:', id);
//     store.setCurrentProject(id);
//     // openModals.value.edit = true;
// }

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
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Project successfully deleted', life: 5000 });
                        store.deleteProject(id);
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: `Could not deleted Project due to an server error: ${error.value?.message.toString()}`, life: 5000 });
                        console.log(error.value?.message.toString());
                    }
                }
                closeModal();
            });
            execute();
            // fetch(`http://localhost:8080/projects/${id}`, {
            //     method: 'DELETE', // Use PUT method to update
            //     headers: {
            //         'Content-Type': 'application/json', // Specify JSON content type
            //         'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsiYWRtaW4iXX0.aDtpbHAIH0jFCUygozLT_kXDFT76Sou3RNOFe3DUeGibUBOtoCXT0lwE0zcnQgN0yoHqsGKNWB9BdUsInT30ww'
            //     },
            // }).then(response => {
            //     if (!response.ok) {
            //         throw new Error('Network response was not ok');
            //     }
            //     return response.json(); // Parse JSON response
            // }).then(data => {
            //     store.deleteProject(id);
            //     toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Project successfully deleted', life: 5000 });
            // }).catch(error => {
            //     toast.add({ severity: 'error', summary: 'Error', detail: 'The was a problem deleting the project', life: 5000 });
            // });
        },
    });
};

const onEdit = (id: number) => {
    store.setCurrentProject(id);
    project = ref({ ...store.currentProject as Project });
    visible.value = true;
};

function updateProject() {
    console.log("executed")
    const { error, isFetching, isReady, state, execute } = usePutProjectQuery({
        body: {
            name: project.value.name,
            version: project.value.version,
            description: project.value.description,
            equivalence_required: project.value.equivalence_required!,
            status_required: project.value.status_required!,
            id: project.value.id!
        }
    });
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully', life: 8000 });
                store.updateProject(project.value);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message.toString()}`, life: 8000 });
                console.log(error.value?.message.toString());
            }
        }
        closeModal();
    });
    execute();
};

function closeModal() {
    visible.value = false;
}

</script>

<style>
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