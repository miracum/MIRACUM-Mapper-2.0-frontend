<template>
    <!-- v-model="localMappingValue[props.field + '_' + props.roleId]"  -->
    <!-- <AutoComplete v-model="value" dropdown :suggestions="codeSystemNames" @complete="search" /> -->
    <AutoComplete :suggestions="codeSystems" optionLabel="name" field="name" forceSelection @complete="search"
        @item-select="props['item-select']">
        <!-- <template #option="slotProps">
            <div v-if="error()" style="color: red;">{{ error() }}</div>
            <div v-else>
                <div style="font-weight: bold;">{{ firstElement(slotProps) }}</div>
                <div>{{ secondElement(slotProps) }}</div>
            </div>
        </template> -->
    </AutoComplete>
</template>


<!-- TODO: use Dropdown/Selects here -->

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import type { AutoCompleteCompleteEvent, AutoCompleteOptionSelectEvent } from 'primevue/autocomplete';

// input of the component
const props = defineProps({
    // field: {            // meaning or code
    //     type: String,
    //     required: true
    // },
    'item-select': {
        type: Function as PropType<(event: AutoCompleteOptionSelectEvent) => void>,
        required: false
    },
});

const search = (event: AutoCompleteCompleteEvent) => {
    // console.log(event);
    // filteredCodeSystemNames.value = codeSystemNames.value.filter((codeSystemName) => {
    //     return codeSystemName.toLowerCase().includes(event.query.toLowerCase());
    // });
    codeSystems.value = codeSystems.filter((codeSystem) => {
        return codeSystem.name.toLowerCase().includes(event.query.toLowerCase());
    });
    console.log(codeSystems.value);
};

const codeSystems = [
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
    },
]

// const codeSystemNames = ref(codeSystems.map((codeSystem) => codeSystem.name));

const filteredCodeSystemNames = ref();

</script>