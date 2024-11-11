<template>
    <MultiSelect optionLabel="label" placeholder="Any" :maxSelectedLabels="1">
        <template #option="slotProps">
            <Tag :value="slotProps.option.label" :severity="slotProps.option.severity" />
        </template>
    </MultiSelect>
</template>


<script setup lang="ts">

</script>