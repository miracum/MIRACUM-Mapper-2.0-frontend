<template>
    <p>Dialog Visible: {{ props.visible }}</p>
    <Dialog :visible="props.visible" modal header="Edit Profile" :style="{ width: '30rem' }">
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
        <div class="flex-container">
            <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
            <Button type="button" label="Save" @click="updateProject"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">

import { ref, watch } from "vue";
import { useProjectStore } from '@/stores/project';
import { usePutProjectQuery } from '@/composables/queries/project-query';
import { useToast } from "primevue/usetoast";
// import { equivalence } from "@/client/client-old";
import type { Project } from '@/stores/project';
const emit = defineEmits(['close']);

const props = defineProps({
    visible: Boolean
});


const store = useProjectStore();
const project = ref({ ...store.currentProject as Project });
const toast = useToast();

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

function updateProject() {
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully' });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message}` });
            }
            closeModal();
        }
    });
    execute();
};

function closeModal() {
    emit('close');
}

</script>

<style scoped>
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