<template>
    <Tag :value="getRoleLabel(props.value)" :severity="getRoleSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getRoleLabel, getRoleSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>