<template>
    <Select :options="versions" placeholder="Select Version" optionLabel="version_name">
        <template #value="slotProps">
            <div v-if="slotProps.value">
                <Tag :value="slotProps.value.version_name" />
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="{ option }">
            <Tag :value="option.version_name" />
        </template>
    </Select>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import Select from 'primevue/select';
import { type GetCodeSystem, type GetCodeSystemVersion, useCodeSystemStore } from '@/stores/codesystem';

const props = defineProps({
    codeSystem: {
        type: Object as PropType<GetCodeSystem | number | null>,
        required: true
    }
});

const store = useCodeSystemStore();

let versions = ref<Array<GetCodeSystemVersion>>([]);
watch(() => props.codeSystem, (newCodeSystem) => {
    let codeSystemId = null;
    if (typeof newCodeSystem === 'number') {
        codeSystemId = newCodeSystem;
    } else if (newCodeSystem) {
        codeSystemId = newCodeSystem.id;
    }
    if (codeSystemId) {
        versions.value = store.getVersions(codeSystemId).value;
    } else {
        versions.value = [];
    }
});
watch(() => versions.value, (newVersions) => {
    console.log('CodeSystemVersionSelect.vue: versions changed', newVersions);
});

</script>