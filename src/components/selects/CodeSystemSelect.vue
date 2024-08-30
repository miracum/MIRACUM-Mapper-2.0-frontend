<template>
    <!-- v-model="localMappingValue[props.field + '_' + props.roleId]"  -->
    <Select :options="codeSystems" filter optionLabel="name" optionGroupLabel="name"
        :filterFields="['codeSystemName', 'name']" optionGroupChildren="versions" placeholder="Select a Code System">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex flex-col items-start">
                <div style="font-weight: bold;">{{ slotProps.value.codeSystemName }}</div>
                <!-- <div>{{ slotProps.value.description }}</div> -->
                <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <!-- <template #option="slotProps">
            <div style="font-weight: bold;">{{ slotProps.option.name }}</div>
            <div>{{ slotProps.option.description }}</div>
            <div>{{ slotProps.option.name }}</div>
        </template> -->
        <template #optiongroup="slotProps">
            <div>{{ slotProps.option.name }}</div>
        </template>
    </Select>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import Select from 'primevue/select';

// to specify the type of slotProps (copied from the primevue documentation)

const search = (event: AutoCompleteCompleteEvent) => {
    const text = event.query.toLowerCase()
    var code = null;
    var meaning = null;
};

const codeSystems = ref([
    {
        name: 'SNOMED CT',
        // description: 'SNOMED CT is a clinical terminology that is used for the electronic exchange of clinical health information.',
        versions: [
            {
                id: 1,
                name: 'v1.2.5',
                codeSystemName: 'SNOMED CT'
            },
            {
                id: 2,
                name: 'v1.2.6',
                codeSystemName: 'SNOMED CT'
            },
            {
                id: 3,
                name: 'v1.2.7',
                codeSystemName: 'SNOMED CT'
            }
        ]
    },
    {
        name: 'LOINC',
        versions: [
            {
                id: 1,
                name: '2.3.4',
                codeSystemName: 'LOINC'
            },
            {
                id: 2,
                name: '2.3.5',
                codeSystemName: 'LOINC'
            },
            {
                id: 3,
                name: '2.3.6',
                codeSystemName: 'LOINC'
            }
        ]
    }
])


</script>