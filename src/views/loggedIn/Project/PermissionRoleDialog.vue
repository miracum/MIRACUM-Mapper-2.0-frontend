<template>
    <Dialog v-model:visible="localVisible" @update:visible="updateVisible" modal header="Permission Information"
        :style="{ width: '450px' }">
        <p>{{ roleMessage }}</p>
        <template #footer>
            <Button label="Ok" icon="pi pi-check" text @click="closeModal" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">

import { computed, ref, watch } from "vue";
const emit = defineEmits(['update:visible']);

const props = defineProps({
    visible: Boolean,
    role: String
});

// Local state mirroring the prop
const localVisible = ref(props.visible);

// Watch for prop changes to update the local state
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});

function closeModal() {
    emit('update:visible', false);
}

function updateVisible(value: boolean) {
    emit('update:visible', value);
}

// Computed property to determine the message based on the role
const roleMessage = computed(() => {
    if (props.role === 'reviewer') {
        return 'As a reviewer, you can view mappings with all its content but you cannot edit them. In the future, a reviewer will be able to comment on mappings and provide feedback.';
    } else if (props.role === 'project_owner') {
        return 'As a project owner, you can view and edit all mappings in the project. You can also manage settings about the project, e.g. the permissions of other users form the project or update code system roles.';
    } else if (props.role === 'editor') {
        return 'As an editor, you can view and edit all mappings in the project. Project permissions can not be managed by an editor and requires a project owner to do so.';
    } else {
        return 'Role information is not available.';
    }
});

</script>

<style scoped>
.custom-dialog {
    max-width: 100px;
}
</style>