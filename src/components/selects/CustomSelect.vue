<template>
    <Select :id="props.id" :required="props.required" :invalid="props.invalid" :options="props.options"
        :placeholder="props.placeholder" optionLabel="label" optionValue="value">
        <template #value="slotProps"> <!-- v-model="localModelValue" -->
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
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import { getLabel, getSeverity } from '@/utils/selectElement';
import Select from 'primevue/select';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    // modelValue: {
    //     type: [String, null] as PropType<string | null>,
    //     required: true
    // },
    options: {
        type: Array as PropType<SelectElement[]>,
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

// TODO: all props except options can be deleted

// const emit = defineEmits(['update:modelValue']);

// const localModelValue = ref<string | null>(props.modelValue);

// watch(localModelValue, (newValue) => {
//     emit('update:modelValue', newValue);
// });
</script>