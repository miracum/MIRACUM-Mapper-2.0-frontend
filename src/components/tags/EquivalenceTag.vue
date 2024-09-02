<template>
    <Tag :value="getEquivalenceLabel(props.value)" :severity="getEquivalenceSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getEquivalenceLabel, getEquivalenceSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>