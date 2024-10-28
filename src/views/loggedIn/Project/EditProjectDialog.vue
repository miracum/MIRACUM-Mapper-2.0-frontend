<template>
    <Dialog v-model:visible="localVisible" @update:visible="updateVisible" modal header="Update Project">
        <div class="dialog-content">
            <span class="p-text-secondary block mb-5">Update information about the project</span>
            <div class="flex-row">
                <FloatLabel variant="on" class="flex-item flex-item-name">
                    <InputText id="name" v-model="project.name" />
                    <label for="name">Name</label>
                </FloatLabel>
                <FloatLabel variant="on" class="flex-item flex-item-version">
                    <InputText id="version" v-model="project.version" />
                    <label for="version">Version</label>
                </FloatLabel>
            </div>
            <FloatLabel variant="on" class="full-width">
                <Textarea v-model="project.description" rows="6" cols="80" />
                <label for="description">Description</label>
            </FloatLabel>
        </div>

        <div class="buttons">
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
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully', life: 10000 });
                store.updateProject(project.value);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
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
.dialog-content>*+* {
    margin-top: 1.5rem;
}

.flex-item {
    width: 100%;
    /* Ensure flex items take up the full width of their container */
}

.flex-item input {
    width: 100%;
    /* Ensure input fields within flex items take up the full width */
}

.buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}

.flex-row {
    display: flex;
    gap: 1rem;
}

.full-width {
    width: 100%;
    /* Make the container take up the full width */
}

.full-width>Textarea {
    width: 100%;
    /* Ensure the Textarea expands to fill its container */
}

.flex-item-name {
    flex: 3;
    /* Takes up 2/3rds of the space */
}

.flex-item-version {
    flex: 1;
    /* Takes up 1/3rd of the space */
}
</style>