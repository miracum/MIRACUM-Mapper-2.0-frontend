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
import { ref, type PropType } from 'vue';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';

const value = ref("");

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



</script>