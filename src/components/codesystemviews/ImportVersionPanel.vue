<template>
    <Panel class="grid-item" header="Import Version">
        <div class="mb-3">
            Import concepts to the version <strong>{{ props.version.version_name }}</strong> of code system <strong>{{ props.codesystem.name }}</strong>.
        </div>
        <div>
            Code system type: <strong>{{ props.codesystem.type }}</strong>
            <br />
            Version release date: <strong>{{ props.version.release_date }}</strong>
            <br />
        </div>
        <div v-show="!uploading && !uploaded">
            <ImportButtonsGeneric v-if="props.codesystem.type === 'GENERIC'" :codesystem="props.codesystem" :version="props.version" @upload=onUpload />
            <ImportButtonsLoinc v-else-if="props.codesystem.type === 'LOINC'" :codesystem="props.codesystem" :version="props.version" @upload="onUpload" />
            <ImportButtonsIcd v-else-if="props.codesystem.type === 'ICD_10_GM'" :codesystem="props.codesystem" :version="props.version" @upload="onUpload" />
            <ImportButtonsSnomed v-else-if="props.codesystem.type === 'SNOMED_CT'" :codesystem="props.codesystem" :version="props.version" @upload="onUpload" />
        </div>
        <div v-if="uploading" class="mt-4">
            Please wait while the file is being uploaded. This may take a while depending on the size of the file.
            <ProgressBar mode="indeterminate" class="mt-2" style="height: 6px"/>
        </div>
        <div v-if="uploaded" class="mt-4">
            The file has been uploaded successfully. You can see the import status in the import status panel.
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ProgressBar from 'primevue/progressbar';
import type { GetCodeSystemVersion, GetCodeSystem } from '@/stores/codesystem';

const props = defineProps({
    codesystem: {
        type: Object as () => GetCodeSystem,
        required: true
    },
    version: {
        type: Object as () => GetCodeSystemVersion,
        required: true
    },
    uploadError: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits<{
    (e: 'upload', uploading: boolean, uploaded: boolean, error: boolean): void
}>();

const uploading = ref(false);
const uploaded = ref(false);

const onUpload = (uploadingEvent: boolean, uploadedEvent: boolean, errorEvent: boolean) => {
    if (errorEvent) {
        uploading.value = false;
        uploaded.value = false;
        emit('upload', false, false, true);
        return;
    }

    uploading.value = uploadingEvent;
    uploaded.value = uploadedEvent;
    emit('upload', uploading.value, uploaded.value, false);
};

watch(() => props.uploadError, (newVal) => {
    if (newVal) {
        uploading.value = false;
        uploaded.value = false;
    }
});

</script>

<style scoped>
.grid-item {
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
}

.p-error {
    display: block;
}

.type-select {
    width: 100%;
}
</style>
