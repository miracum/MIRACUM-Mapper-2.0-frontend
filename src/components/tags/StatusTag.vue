<template>
    <Tag :value="getStatusLabel(props.value)" :severity="getStatusSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getStatusLabel, getStatusSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>