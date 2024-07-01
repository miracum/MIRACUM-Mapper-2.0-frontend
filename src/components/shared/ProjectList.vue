<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '30rem' }">
        <span class="p-text-secondary block mb-5">Update your information.</span>
        <div class="flex-row">
            <FloatLabel class="flex-item">
                <InputText id="title" v-model="value" />
                <label for="title">Username</label>
            </FloatLabel>
            <FloatLabel class="flex-item">
                <InputText id="version" v-model="value" />
                <label for="version">Version</label>
            </FloatLabel>
        </div>
        <FloatLabel>
            <Textarea v-model="description" rows="5" cols="30" />
            <label for="description">Description</label>
        </FloatLabel>
        <div class="flex-container">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Save" @click="visible = false"></Button>
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
    <!-- Data View -->
    <DataView v-else-if="props.elements.length > 0" :value="props.elements" paginator :rows="5">
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

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { computed } from 'vue';
import { useProjectStore } from '@/stores/project';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { ref } from "vue";

const visible = ref(false);

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
    elements: Array,
    loading: Boolean // Add this line
});

const store = useProjectStore();
// store.setProjects(props.elements);


const elementToEdit = computed(() => store.currentProject);

// function openEditModal(id) {
//     console.log('Opening edit modal for project:', id);
//     store.setCurrentProject(id);
//     // openModals.value.edit = true;
// }

const onDelete = (id, name) => {
    confirm.require({
        message: 'Are you sure you want to Delete the Project ' + name + '?',
        header: 'Delete Project',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            fetch(`http://localhost:8080/projects/${id}`, {
                method: 'DELETE', // Use PUT method to update
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsiYWRtaW4iXX0.aDtpbHAIH0jFCUygozLT_kXDFT76Sou3RNOFe3DUeGibUBOtoCXT0lwE0zcnQgN0yoHqsGKNWB9BdUsInT30ww'
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse JSON response
            }).then(data => {
                store.deleteProject(id);
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Project successfully deleted', life: 3000 });
            }).catch(error => {
                toast.add({ severity: 'error', summary: 'Error', detail: 'The was a problem deleting the project', life: 3000 });
            });

        },
    });
};

const onEdit = (id) => {
    store.setCurrentProject(id);
    visible.value = true;
    console.log('Opening edit modal for project:', id);
    // confirm.require({
    //     group: 'templating',
    //     header: 'Confirmation',
    //     message: 'Please confirm to proceed moving forward.',
    //     icon: 'pi pi-exclamation-circle',
    //     acceptIcon: 'pi pi-check',
    //     rejectIcon: 'pi pi-times',
    //     rejectClass: 'p-button-outlined p-button-sm',
    //     acceptClass: 'p-button-sm',
    //     rejectLabel: 'Cancel',
    //     acceptLabel: 'Save',
    //     accept: () => {
    //         toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    //     },
    //     reject: () => {
    //         toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    //     }
    // });
};
// const onEdit = (id, name) => {
//     confirm.require({
//         message: 'Are you sure you want to Edit the Project ' + name + '?',
//         header: 'Edit Project',
//         icon: 'pi pi-info-circle',
//         rejectLabel: 'Cancel',
//         acceptLabel: 'Edit',
//         rejectClass: 'p-button-secondary p-button-outlined',
//         acceptClass: 'p-button-danger',
//         accept: () => {
//             toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record Edited', life: 3000 });
//         },
//         reject: () => {
//             toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
//         }
//     });
// };

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

.flex-container {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    /* Adjust gap as needed */
    margin-top: 16px;
    /* Adjust margin as needed */
    width: 100%;
    /* Ensure the container takes full width */
}

.flex-row {
    display: flex;
    justify-content: space-between;
    /* Adjusts the space between the items */
    margin-bottom: 1rem;
    /* Adds spacing below the row for separation */
}

.flex-item {
    flex: 1;
    /* Allows each item to grow equally */
    margin-right: 1rem;
    /* Adds spacing between the flex items */
}

.flex-item:last-child {
    margin-right: 0;
    /* Removes margin from the last item to avoid extra spacing */
}
</style>