<template>
    <MultiSelect :options="conceptStatusElements" placeholder="Any" optionLabel="label" optionValue="value"
        :maxSelectedLabels="4" display="chip">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
        </template>
    </MultiSelect>
</template>

<script setup lang="ts">

import { conceptStatusElements } from '../../utils/selectElement';

</script>