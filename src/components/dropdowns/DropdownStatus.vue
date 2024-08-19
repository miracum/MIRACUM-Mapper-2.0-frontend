<template>
    <DropdownTag :id="id" :required="props.required" :invalid="props.invalid" v-model="localModelValue"
        :options="statusDropdownElements" :placeholder="placeholder" optionLabel="label" optionValue="value" />
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue';
import DropdownTag from '@/components/dropdowns/DropdownTag.vue';
import { getOptions } from '@/composables/utils';
import type { DropdownElement } from '@/composables/utils';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    modelValue: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: false
    },
    invalid: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ''
    },
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref<string | null>(props.modelValue);

watch(localModelValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// const getStatus = (status: string): string => {
//     switch (status) {
//         case 'active':
//             return 'success';
//         case 'inactive':
//             return 'danger';
//         case 'pending':
//             return 'warning';
//         default:
//             return 'info';
//     }
// };

// const getLabel = (status: string): string => {
//     return statuses[status];
// };

// const statuses: Record<string, string> = { 'active': "Active", 'inactive': "Inactive", 'pending': "Pending" };

// const statusOptions = ref<Array<{ label: string, value: string }>>(getOptions(statuses));

const statusDropdownElements: DropdownElement[] = [
    { label: 'Active', value: 'active', severity: 'success' },
    { label: 'Inactive', value: 'inactive', severity: 'danger' },
    { label: 'Pending', value: 'pending', severity: 'warning' }
];

</script>