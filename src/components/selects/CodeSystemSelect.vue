<template>
    <Select :options="props.codeSystems" filter optionLabel="name" optionGroupLabel="name"
        :filterFields="['codeSystemName', 'name']" optionGroupChildren="versions" placeholder="Select a Code System">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex flex-col items-start">
                <div style="font-weight: bold;">{{ slotProps.value.codeSystemName }}</div>
                <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #optiongroup="slotProps">
            <div>{{ slotProps.option.name }}</div>
        </template>
    </Select>
</template>


<script setup lang="ts">
import Select from 'primevue/select';

const props = defineProps({
    codeSystems: {
        type: Array,
        required: true
    },
});


</script>