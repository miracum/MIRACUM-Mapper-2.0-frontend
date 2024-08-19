<template>
    <DropdownTag :id="id" :required="props.required" :invalid="props.invalid" v-model="localModelValue"
        :options="equivalenceDropdownElements" :placeholder="placeholder" optionLabel="label" optionValue="value" />
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue';
import DropdownTag from '@/components/dropdowns/DropdownTag.vue';
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

const equivalenceDropdownElements: DropdownElement[] = [
    { label: 'Related To', value: 'related-to', severity: 'info' },
    { label: 'Equivalent', value: 'equivalent', severity: 'success' },
    { label: 'Narrower', value: 'source-is-narrower-than-target', severity: 'warning' },
    { label: 'Broader', value: 'source-is-broader-than-target', severity: 'warning' },
    { label: 'Not Related', value: 'not-related', severity: 'danger' }
];
</script>