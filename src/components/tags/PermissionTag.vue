<template>
    <Tag :value="getUserPermissionsLabel(props.value)" :severity="getUserPermissionsSeverity(props.value)" />
</template>

<script setup lang="ts">

import { getUserPermissionsLabel, getUserPermissionsSeverity } from '@/utils/selectElement';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

</script>
