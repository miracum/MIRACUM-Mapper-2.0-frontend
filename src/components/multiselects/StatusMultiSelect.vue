<template>
    <MultiSelect :options="statusElements" placeholder="Any" optionLabel="label" optionValue="value"
        :maxSelectedLabels="3" display="chip">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
        </template>
    </MultiSelect> <!-- :options="props.options" -->
</template>

<script setup lang="ts">
// import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { statusElements } from '../../utils/selectElement';

// Map the statusElements to get their values
// const statusValues = statusElements.map(element => element.value);
</script>