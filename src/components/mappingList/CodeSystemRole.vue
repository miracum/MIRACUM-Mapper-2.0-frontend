<template>
    <div style="display: flex; gap: 5px;">
        <RoleTag :value="role.type" />
        <span class="name">{{ role.system.name }}</span>
        <span class="code p-text-secondary">{{ role.name }}</span>
    </div>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from 'vue';
import RoleTag from '@/components/tags/RoleTag.vue';

// TODO use a proper type here when defined in the future

const props = defineProps({
    role: {
        type: Object as PropType<{ type: string; system: { name: string }; name: string }>,
        required: true
    }
});
</script>