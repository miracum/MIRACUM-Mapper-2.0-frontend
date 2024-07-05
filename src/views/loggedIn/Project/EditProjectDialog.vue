<template>
    <Dialog v-model:visible="localVisible" @update:visible="updateVisible" modal header="Edit Profile"
        :style="{ width: '30rem' }">
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

import { ref, watch, onMounted } from "vue";
import { useProjectStore } from '@/stores/project';
import { usePutProjectQuery } from '@/composables/queries/project-query';
import { useToast } from "primevue/usetoast";
import type { Project } from '@/stores/project';
const emit = defineEmits(['update:visible']);

const props = defineProps({
    visible: Boolean
});


// Local state mirroring the prop
const localVisible = ref(props.visible);

// Watch for prop changes to update the local state
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});

const store = useProjectStore();

// A ref is used here to because the current project should be a copy of the store project. When editing the current project, the store should not change. But as soon as the user clicks save, the store should be updated with the new project.
const project = ref({ ...store.currentProject as Project });

watch(localVisible, (newVal) => {
    if (newVal) {
        project.value = { ...store.currentProject as Project };
    }
});


const toast = useToast();

function updateProject() {
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
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully' });
                store.updateProject(project.value);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}` });
            }
            closeModal();
        }
    });
    execute();
};

function closeModal() {
    emit('update:visible', false);
}

function updateVisible(value: boolean) {
    emit('update:visible', value);
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