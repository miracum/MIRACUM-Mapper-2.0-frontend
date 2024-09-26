<template>
    <MultiSelect :options="props.options" optionLabel="label" placeholder="Any" style="min-width: 14rem"
        :maxSelectedLabels="1">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
        </template>
    </MultiSelect>
</template>


<script setup lang="ts">
import type { SelectElement } from '../../utils/selectElement';
import type { PropType } from 'vue';

const props = defineProps({
    options: {
        type: Array as PropType<SelectElement[]>,
        required: true
    },
});

</script>