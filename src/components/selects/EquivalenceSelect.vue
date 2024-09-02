<template>
    <CustomSelect :id="id" :required="props.required" :invalid="props.invalid" :options="equivalenceElements"
        :placeholder="placeholder" />
    <!-- v-model="localModelValue"  -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { equivalenceElements } from '../../utils/selectElement';

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

// TODO: all props can be deleted

// const emit = defineEmits(['update:modelValue']);

// const localModelValue = ref<string | null>(props.modelValue);

// watch(localModelValue, (newValue) => {
//     emit('update:modelValue', newValue);
// });

</script>