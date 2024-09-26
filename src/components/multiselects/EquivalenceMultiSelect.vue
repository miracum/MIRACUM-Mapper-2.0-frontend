<template>
    <MultiSelect :options="equivalenceValues" placeholder="Any" style="min-width: 14rem" :maxSelectedLabels="0">
        <template #option="slotProps">
            <Tag :value="getEquivalenceLabel(slotProps.option)" :severity="getEquivalenceSeverity(slotProps.option)" />
        </template>
    </MultiSelect> <!-- :options="props.options" -->
</template>

<script setup lang="ts">
// import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { equivalenceElements, getEquivalenceLabel, getEquivalenceSeverity } from '../../utils/selectElement';

// Map the equivalenceElements to get their values
const equivalenceValues = equivalenceElements.map(element => element.value);

</script>