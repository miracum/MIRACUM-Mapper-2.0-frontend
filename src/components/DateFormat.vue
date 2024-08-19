<template>
    {{ formatDate(props.value) }}
</template>

<script setup lang="ts">

const props = defineProps({
    value: {
        type: Date,
        required: true
    }
});

const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

</script>