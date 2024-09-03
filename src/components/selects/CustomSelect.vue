<template>
    <Select :options="props.options" :placeholder="props.placeholder" optionLabel="label" optionValue="value">
        <template #value="slotProps">
            <div v-if="slotProps.value">
                <Tag :value="getLabel(props.options, slotProps.value)"
                    :severity="getSeverity(props.options, slotProps.value)" />
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="{ option }">
            <Tag :value="option.label" :severity="option.severity" />
        </template>
    </Select>
</template>

<script setup lang="ts">
import type { SelectElement } from '../../utils/selectElement';
import type { PropType } from 'vue';
import { getLabel, getSeverity } from '@/utils/selectElement';
import Select from 'primevue/select';

const props = defineProps({
    options: {
        type: Array as PropType<SelectElement[]>,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
});

</script>