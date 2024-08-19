<template>
    <Dropdown :id="props.id" :required="props.required" :invalid="props.invalid" v-model="localModelValue"
        :options="props.options" :placeholder="props.placeholder" :optionLabel="props.optionLabel"
        :optionValue="props.optionValue">
        <template #value="slotProps">
            <div v-if="slotProps.value">
                <Tag :value="getLabel(slotProps.value)" :severity="getSeverity(slotProps.value)" />
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="{ option }">
            <Tag :value="option.label" :severity="option.severity" />
        </template>
    </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownElement } from '@/composables/utils';
import { defineProps, ref, watch, defineEmits } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    modelValue: {
        type: String,
        required: true
    },
    options: {
        type: Array as PropType<DropdownElement[]>,
        required: true
    },
    optionLabel: {
        type: String,
        required: true
    },
    optionValue: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    invalid: {
        type: Boolean,
        default: false
    }
});

const getSeverity = (value: string): string => {
    return props.options.find((element) => element.value === value)?.severity || '';
};

const getLabel = (value: string): string => {
    return props.options.find((element) => element.value === value)?.label || '';
};

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref<string | null>(props.modelValue);

watch(localModelValue, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>