<template>
    <MappingDialog header="Edit mapping" :saveMapping="saveMapping" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useProjectStore } from '@/stores/project';
import type { UpdateMapping } from '@/stores/mappings'
import { useUpdateMappingQuery } from '@/composables/queries/mapping-query';
import { useToast } from "primevue/usetoast";
import { watch } from 'vue';


const props = defineProps({
    onSubmit: {
        type: Function as PropType<(mapping: any) => void>,
        required: true
    },
});

const projectStore = useProjectStore();
const toast = useToast();


function saveMapping(mapping: any) {
    if (!projectStore.currentProjectDetails) {
        return;
    }

    const saved_mapping: UpdateMapping = {
        id: mapping.id,
        equivalence: mapping.equivalence,
        status: mapping.status,
        comment: mapping.comment,
        elements: [],
    };

    for (const role of projectStore.currentProjectDetails.code_system_roles) {
        saved_mapping.elements.push({
            codeSystemRole: role.id,
            concept: mapping[`id_${role.id}`],
        });
    }

    const { error, isFetching, isReady, state, execute } = useUpdateMappingQuery(projectStore.currentProjectDetails.id, saved_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping updated successfully', life: 10000 });
                // console.log(state);
                props.onSubmit(mapping);
                // mappingStore.updateMapping(updated_mapping);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Mapping due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    })
}

</script>