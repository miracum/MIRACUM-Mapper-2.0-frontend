<template>
    <div class="icon-title-subtitle text-center">
        <Button :disabled="disabled" :icon="icon" severity="secondary" class="mb-4" raised />
        <h2 class="title text-2xl mb-2">{{ title }}</h2>
        <p class="subtitle text-sm text-gray-600">{{ subtitle }}</p>
    </div>
</template>

<script setup>

const props = defineProps({
    icon: {
        type: String,
        Required: true
    },
    title: {
        type: String,
        Required: true
    },
    subtitle: {
        type: String,
        Required: true
    },
    disabled: {
        type: Boolean,
        default: true
    },
});
</script>

<style scoped>
.icon-title-subtitle {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>