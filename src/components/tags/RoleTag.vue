<template>
    <Tag :value="props.value" :severity="getRoleSeverity(props.value)" />
</template>

<script setup lang="ts">

import { defineProps } from 'vue';

const props = defineProps({
    value: {
        type: String,
        required: true
    }
});

const getRoleSeverity = (role: string) => {
    switch (role) {
        case 'source':
            return 'info';
        case 'target':
            return 'info';
        default:
            return 'info';
    }
}

</script>