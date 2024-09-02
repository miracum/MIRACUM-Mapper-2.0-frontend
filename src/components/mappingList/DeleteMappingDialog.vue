<template>
    <Dialog v-model:visible="localVisible" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="mappings.length === 1">Are you sure you want to delete this mapping?</span>
            <span v-else>Are you sure you want to delete the selected {{ mappings.length }} mappings?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="closeDialog" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteMappings" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/project';
import { useDeleteMappingQuery } from '@/composables/queries/mapping-query';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    mappings: {
        type: Array,
        required: true
    },
    onDelete: {
        type: Function as PropType<(mappings: Object[]) => void>,
        required: false
    }
});

const emit = defineEmits(['update:visible']);
const localVisible = ref(props.visible);
const toast = useToast();
const projectStore = useProjectStore();

watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});

watch(localVisible, (newVal) => {
    emit('update:visible', newVal);
});

function closeDialog() {
    localVisible.value = false;
}

function deleteMappings() {
    // const successfullyDeleted: Array<Object> = [];
    props.mappings.forEach(mapping => {
        if (!projectStore.currentProjectDetails) {
            return;
        }
        const { state, isReady, isFetching, error, execute } = useDeleteMappingQuery(projectStore.currentProjectDetails.id, mapping.id);
        watch(isFetching, async (newVal) => {
            if (!newVal) {
                if (isReady.value) {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping successfully deleted', life: 10000 });
                    // projectStore.deleteProject(mapping.id);
                    // successfullyDeleted.push(mapping);
                    const deleted_mappings = Array<Object>();
                    deleted_mappings.push(mapping);
                    if (props.onDelete) {
                        props.onDelete(deleted_mappings);
                    }
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: `Could not delete Mapping due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                }
            }
        });
        execute();
    });
    // because asynchronous, for some reason the length is 0 ???????
    // const a = successfullyDeleted.length;
    // console.log(a);
    // console.log( ...successfullyDeleted);
    // console.log(successfullyDeleted.length>0 && props.onDelete);
    // console.log(successfullyDeleted.length);
    // console.log(successfullyDeleted.length>0);
    // console.log(1>0)
    // console.log(1 > 0 && props.onDelete);
    // console.log(successfullyDeleted);
    // if (successfullyDeleted.length > 0 && props.onDelete) {
    //     console.log("ondelete is called")
    //     props.onDelete(successfullyDeleted);
    // }
    closeDialog();
}
</script>

<style scoped>
.confirmation-content {
    display: flex;
    align-items: center;
}
</style>