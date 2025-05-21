<template>
    <Tag :value="getConceptStatusLabel(props.value)" :severity="getConceptStatusSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getConceptStatusLabel, getConceptStatusSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>