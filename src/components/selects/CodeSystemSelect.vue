<template>
    <Select v-model="selectedCodeSystem" :options="props.codeSystems" placeholder="Select Codesystem" optionLabel="name" @change="emitSelectedCodeSystem">
        <template #value="slotProps">
            <div v-if="slotProps.value">
                <Tag :value="slotProps.value.name" />
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="{ option }">
            <Tag :value="option.name" />
        </template>
    </Select>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue';
import Select from 'primevue/select';
import type { GetCodeSystem } from '@/stores/codesystem';

const props = defineProps({
    codeSystems: {
        type: Array as PropType<GetCodeSystem[]>,
        required: true
    }
});

const selectedCodeSystem = ref<GetCodeSystem | null>(null);

const emit = defineEmits(['update:selectedCodeSystem']);

function emitSelectedCodeSystem() {
    emit('update:selectedCodeSystem', selectedCodeSystem.value);
}

</script>