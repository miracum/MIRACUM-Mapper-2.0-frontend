<template>
    <div :class="containerClass">
        <slot></slot>
    </div>
    <div class="button-container">
        <Button v-if="!noCancel" label="Cancel" severity="danger" @click="props.onCancel" />
        <Button v-if="submitLabel" :label="props.submitLabel" class="mr-2" severity="success" @click="props.onSubmit" />
    </div>

</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

const props = defineProps({
    submitLabel: {
        type: String
    },
    noCancel: {
        type: Boolean,
        default: false
    },
    onCancel: {
        type: Function as PropType<(payload: MouseEvent) => void>
    },
    onSubmit: {
        type: Function as PropType<(payload: MouseEvent) => void>
    },
    onePanel: {
        type: Boolean
    }
});

const containerClass = computed(() => {
    return props.onePanel ? 'grid-container-one' : 'grid-container';
});

</script>

<style scoped>
.grid-container {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
}

.grid-container-one {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
}

/* stack on smaller screens */
@media (max-width: 1000px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

</style>