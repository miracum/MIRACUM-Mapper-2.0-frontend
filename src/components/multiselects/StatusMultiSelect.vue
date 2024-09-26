<template>
    <MultiSelect :options="statusValues" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="0">
        <template #option="slotProps">
            <Tag :value="getStatusLabel(slotProps.option)" :severity="getStatusSeverity(slotProps.option)" />
        </template>
    </MultiSelect> <!-- :options="props.options" -->
    <!-- <CustomMultiSelect :options="statusElements" /> -->
</template>

<script setup lang="ts">
// import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { statusElements, getStatusLabel, getStatusSeverity } from '../../utils/selectElement';

// Map the statusElements to get their values
const statusValues = statusElements.map(element => element.value);
</script>