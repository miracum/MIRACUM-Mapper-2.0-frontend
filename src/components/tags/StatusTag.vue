<template>
    <Tag :value="getStatusFullLabel(props.value)" :severity="getStatusFullSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getStatusFullLabel, getStatusFullSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>