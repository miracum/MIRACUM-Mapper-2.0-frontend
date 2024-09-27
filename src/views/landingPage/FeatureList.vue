<template>
    <div class="container mx-auto mt-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            <FeatureContainer v-for="(feature, index) in props.features" :key="index" :icon="feature.icon"
                :title="feature.title" :subtitle="feature.subtitle" />
        </div>
    </div>
</template>

<script setup>
import FeatureContainer from './FeatureContainer.vue';

const props = defineProps({
    features: {
        type: Array,
        required: true,
    },
});
</script>