<template>
    <!-- v-model="localMappingValue[props.field + '_' + props.roleId]"  -->
    <AutoComplete :suggestions="filteredConcepts" :field="field" :optionLabel="optionLabel" forceSelection
        @complete="(event) => searchConcept(event)" style="width: 100%">
        <template #option="slotProps">
            <div v-if="error()" style="color: red;">{{ error() }}</div>
            <div v-else>
                <div style="font-weight: bold;">{{ firstElement(slotProps) }}</div>
                <div>{{ secondElement(slotProps) }}</div>
            </div>
        </template>
    </AutoComplete>
</template>


<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useToast } from "primevue/usetoast";
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { useGetConceptsQuery } from '@/composables/queries/mapping-query';
import { useProjectStore } from '@/stores/project';

// to specify the type of slotProps (copied from the primevue documentation)
interface SlotProps {
    option: any;
    index: number;
}

// input of the component
const props = defineProps({
    field: {            // meaning or code
        type: String,
        required: true
    },
    roleId: {
        type: Number,
        required: true
    },
});

const optionLabel = computed(()=> {
    return props.field === 'code' ? 'code' : 'meaning';
});

// for possible error messages
const toast = useToast();

// to access the lookup for codesystemroleids
const projectStore = useProjectStore();

// compute suggestions for code or meaning (request to backend)
const filteredConcepts = ref();
const searchConcept = (event: AutoCompleteCompleteEvent) => {
    const text = event.query.toLowerCase()
    var code = null;
    var meaning = null;
    if (props.field === 'code') {
        code = text;
    } else if (props.field === 'meaning') {
        meaning = text;
    }
    if (!projectStore.currentLookupCodeSystemRoleIds) {
        return;
    }
    const { state, isReady, isFetching, error, execute } = useGetConceptsQuery(projectStore.currentLookupCodeSystemRoleIds[props.roleId], code, meaning, 10);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                filteredConcepts.value = state.value;
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not fetch concepts due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
}

// to display code or meaning first, depending on the field (code or meaning field) in which is being typed
const firstElement = (slotProps: SlotProps) => {
    if (props.field === 'meaning') {
        return slotProps.option.meaning;
    } else if (props.field === 'code') {
        return slotProps.option.code;
    } else {
        return null;
    }
};
const secondElement = (slotProps: SlotProps) => {
    if (props.field === 'meaning') {
        return slotProps.option.code;
    } else if (props.field === 'code') {
        return slotProps.option.meaning;
    } else {
        return null;
    }
};
const error = () => {
    if (props.field !== 'meaning' && props.field !== 'code') {
        console.log('error no first or second field')
        return 'Invalid field value';
    }
    return null;
};

// to use v-model on the mapping prop
// const emit = defineEmits(['update:mapping']);
// const localMappingValue = ref<{ [key: string]: string; }>(props.mapping);
// watch(localMappingValue, (newValue) => {
//     emit('update:mapping', newValue);
// });

// const handleItemSelect = (event: any) => {
//     localMappingValue.value[`meaning_${props.roleId}`] = event.value.meaning;
//     localMappingValue.value[`code_${props.roleId}`] = event.value.code;
//     localMappingValue.value[`id_${props.roleId}`] = event.value.id;
// };

</script>