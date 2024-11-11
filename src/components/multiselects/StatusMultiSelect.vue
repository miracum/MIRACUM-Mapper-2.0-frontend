<template>
    <MultiSelect :options="statusElements" placeholder="Any" optionLabel="label" optionValue="value"
        :maxSelectedLabels="3" display="chip">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
        </template>
    </MultiSelect>
</template>

<script setup lang="ts">

import { statusElements } from '../../utils/selectElement';

</script>