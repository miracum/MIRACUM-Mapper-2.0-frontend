<template>
    <MultiSelect :options="props.option" style="min-width: 14rem">
        <template #option="slotProps">
            <Tag :value="slotProps.label" :severity="slotProps.severity" />
        </template>
    </MultiSelect>
</template>


<script setup lang="ts">
import type { SelectElement } from '../../utils/selectElement';
import type { PropType } from 'vue';
// import { getLabel, getSeverity } from '@/utils/selectElement';
// import Select from 'primevue/select';

const props = defineProps({
    options: {
        type: Array as PropType<SelectElement[]>,
        required: true
    },
    // placeholder: {
    //     type: String,
    //     default: ''
    // },
});

</script>