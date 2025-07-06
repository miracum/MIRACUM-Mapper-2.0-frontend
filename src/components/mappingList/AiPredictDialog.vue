<template>
    <AiDialog header="Predict Loinc Code" :saveMapping="saveMapping" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { useProjectStore } from '@/stores/project';

const props = defineProps({
    onSubmit: {
        type: Function as PropType<(mapping: any) => void>,
        required: true
    },
});

const projectStore = useProjectStore();

function saveMapping(mapping: any) {
    if (!projectStore.currentProjectDetails) {
        return;
    }
    props.onSubmit(mapping);
}

</script>
