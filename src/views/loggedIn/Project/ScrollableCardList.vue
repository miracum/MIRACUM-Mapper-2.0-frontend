<template>
    <ScrollPanel style="width: 100%; height: calc(100vh - 320px)" :dt="{
        bar: {
            // background: '{primary.color}'
        }
    }">
        <div :class="containerClass">
            <template v-if="loading">
                <div v-for="index in 9" :key="index" :class="itemClass">
                    <ProjectCard :loading="true" :project="project" :onEdit="onEdit" :onDelete="onDelete"
                        :navigateToProject="navigateToProject" />
                </div>
            </template>
            <template v-else>
                <div v-for="(project, index) in items" :key="project.id" :class="itemClass">
                    <ProjectCard :loading="false" :project="project" :onEdit="onEdit" :onDelete="onDelete"
                        :navigateToProject="navigateToProject" />
                </div>
            </template>
        </div>
    </ScrollPanel>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue';
import { computed } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    layout: {
        type: String,
        required: true
    },
    onEdit: Function,
    onDelete: Function,
    navigateToProject: Function,
    loading: Boolean
});

const containerClass = computed(() => {
    return props.layout === 'grid' ? 'grid grid-cols-12 gap-4 p-4' : 'gap-4 p-4';
});

const itemClass = computed(() => {
    return props.layout === 'grid' ? 'col-span-12 sm:col-span-12 md:col-span-6 xl:col-span-4 ' : 'card-spacing-list';
});
</script>

<style scoped>
.card-spacing-list {
    margin-bottom: 2rem;
}
</style>