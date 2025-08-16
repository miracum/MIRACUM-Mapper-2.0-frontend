<template>
    <ScrollPanel style="width: 100%; height: calc(100vh - 360px)">
        <div :class="containerClass">
            <template v-if="loading">
                <div v-for="index in 9" :key="index" :class="itemClass">
                    <ProjectCard :loading="true" />
                </div>
            </template>
            <template v-else>
                <div v-for="codesystem in props.items" :key="codesystem.id" :class="itemClass">
                    <CodeSystemCard :loading="false" :codesystem="codesystem" />
                </div>
            </template>
        </div>
    </ScrollPanel>
</template>

<script setup lang="ts">
import CodeSystemCard from './CodeSystemCard.vue';
import { computed } from 'vue';
import type { GetCodeSystem } from '@/stores/codesystem';

const props = defineProps({
    items: {
        type: Array<GetCodeSystem>,
        required: true
    },
    layout: {
        type: String,
        required: true
    },
    loading: {
        type: Boolean,
        required: true
    }
});

const containerClass = computed(() => {
    return props.layout === 'grid' ? 'grid grid-cols-12 gap-4 p-4' : 'gap-4 p-4';
});

const itemClass = computed(() => {
    return props.layout === 'grid' ? 'col-span-12 sm:col-span-12 md:col-span-6 xl:col-span-4 ' : 'mb-4';
});
</script>