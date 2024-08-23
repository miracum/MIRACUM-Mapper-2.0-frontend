<template>
    <CustomDropdown :id="id" :required="props.required" :invalid="props.invalid" :options="statusElements"
        :placeholder="placeholder" optionLabel="label" optionValue="value" /> <!-- v-model="localModelValue"  -->
</template>

<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue';
import CustomDropdown from '@/components/dropdowns/CustomDropdown.vue';
import type { PropType } from 'vue';
import { statusElements } from '../../utils/dropdownElement';

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    // modelValue: {
    //     type: [String, null] as PropType<string | null>,
    //     required: true
    // },
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

// const emit = defineEmits(['update:modelValue']);

// const localModelValue = ref<string | null>(props.modelValue);

// watch(localModelValue, (newValue) => {
//     emit('update:modelValue', newValue);
// });

</script>