<template>
    <MappingDialog header="Add new mapping" :saveMapping="saveMapping" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useProjectStore } from '@/stores/project';
import type { CreateMapping } from '@/stores/mappings'
import { useCreateMappingQuery } from '@/composables/queries/mapping-query';
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


    const saved_mapping: CreateMapping = {
        comment: mapping.comment,
        elements: [],
    };
    if (projectStore.currentProjectDetails.equivalence_required) {
        saved_mapping['equivalence'] = mapping.equivalence;
    }
    if (projectStore.currentProjectDetails.status_required) {
        saved_mapping['status'] = mapping.status;
    }

    for (const role of projectStore.currentProjectDetails.code_system_roles) {
        if (mapping[`id_${role.id}`] != null) {
            saved_mapping.elements.push({
                codeSystemRole: role.id,
                concept: mapping[`id_${role.id}`],
            });
        }
    }

    const { error, isFetching, isReady, state, execute } = useCreateMappingQuery(projectStore.currentProjectDetails.id, saved_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                const new_mapping = state.value;
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping created successfully', life: 10000 });
                props.onSubmit(new_mapping);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not create Mapping due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    })
    execute();
}

</script>