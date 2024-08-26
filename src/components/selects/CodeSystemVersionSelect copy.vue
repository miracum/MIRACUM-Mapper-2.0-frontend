<template>
    <!-- v-model="localMappingValue[props.field + '_' + props.roleId]"  -->
    <AutoComplete v-model="value" dropdown :suggestions="codeSystems" @complete="search" />
    <AutoComplete :suggestions="filteredConcepts" :field="field" forceSelection @complete="search"
        @item-select="props['item-select']">
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
import type { AutoCompleteItemSelectEvent } from 'primevue/autocomplete';
import { ref, watch, type PropType } from 'vue';
import { useToast } from "primevue/usetoast";
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import { useGetConceptsQuery } from '@/composables/queries/mapping-query';
import { useProjectStore } from '@/stores/project';

const value = ref("");

// to specify the type of slotProps (copied from the primevue documentation)
interface SlotProps {
    option: any;
    index: number;
}

// input of the component
const props = defineProps({
    // mapping: {
    //     type: Object as PropType<{ [key: string]: string }>,
    //     required: true
    // },
    field: {            // meaning or code
        type: String,
        required: true
    },
    roleId: {
        type: Number,
        required: true
    },
    'item-select': {
        type: Function as PropType<(event: AutoCompleteItemSelectEvent) => void>,
        required: false
    }
});

const search = (event: AutoCompleteCompleteEvent) => {
    const text = event.query.toLowerCase()
    var code = null;
    var meaning = null;
};

const codeSystems = ref([
    {
        name: 'SNOMED CT',
        versions: [
            {
                id: 1,
                name: '1.2.5'
            },
            {
                id: 2,
                name: '1.2.6'
            },
            {
                id: 3,
                name: '1.2.7'
            }
        ]
    },
    {
        name: 'LOINC',
        versions: [
            {
                id: 1,
                name: '2.3.4'
            },
            {
                id: 2,
                name: '2.3.5'
            },
            {
                id: 3,
                name: '2.3.6'
            }
        ]
    }
])


</script>