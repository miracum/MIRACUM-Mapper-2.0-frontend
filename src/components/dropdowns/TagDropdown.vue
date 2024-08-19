<template>
    <Dropdown :id="props.id" :required="props.required" :invalid="props.invalid" v-model="localModelValue"
        :options="props.options" :placeholder="props.placeholder" optionLabel="label" optionValue="value">
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
    </Dropdown>
</template>

<script setup lang="ts">
import type { DropdownElement } from '../../utils/dropdownElement';
import { defineProps, ref, watch, defineEmits } from 'vue';
import type { PropType } from 'vue';
import { getLabel, getSeverity } from '@/utils/dropdownElement';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    modelValue: {
        type: [String, null] as PropType<string | null>,
        required: true
    },
    options: {
        type: Array as PropType<DropdownElement[]>,
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

const emit = defineEmits(['update:modelValue']);

const localModelValue = ref<string | null>(props.modelValue);

watch(localModelValue, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>