<template>
    <Panel class="grid-item" header="Import Version">
        <div class="mb-3">
            Import concepts to the version <strong>{{ version.version_name }}</strong> of code system <strong>{{ codesystem.name }}</strong>.
        </div>
        <div>
            Code system type: <strong>{{ codesystem.type }}</strong>
            <br />
            Version release date: <strong>{{ version.release_date }}</strong>
            <br />
        </div>
        <div v-if="!uploading">
            <div class="flex mt-4">
                <FileUpload ref="main_file" :choose-label="mainLabel" mode="basic" :accept="mainAccept" />
            </div>
            <div class="flex mt-4">
                <Button label="Import" @click="upload" severity="secondary" />
            </div>
        </div>
        <div v-else class="mt-4">
            <div v-if="!uploaded">
                Please wait while the file is being uploaded. This may take some minutes depending on the size of the file.
                <ProgressBar mode="indeterminate" class="mt-2" style="height: 6px"/>
            </div>
            <div v-else>
                The file has been uploaded successfully. You can see the import status in the import status panel.
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GetCodeSystemVersion, GetCodeSystem } from '@/stores/codesystem';
import { useToast } from 'primevue/usetoast';
import ProgressBar from 'primevue/progressbar';


const props = defineProps({
    codesystem: {
        type: Object as () => GetCodeSystem,
        required: true
    },
    version: {
        type: Object as () => GetCodeSystemVersion,
        required: true
    },
    onUpload: {
        type: Function,
        required: true
    },
    uploading: {
        type: Boolean,
        required: true
    },
    uploaded: {
        type: Boolean,
        required: true
    },
});

const toast = useToast();

const mainAccept = ref();
const mainLabel = ref();
switch (props.codesystem.type) {
    case 'LOINC':
        mainAccept.value = 'text/csv';
        mainLabel.value = 'CSV-File';
        break;
    case 'ICD_10_GM':
        mainAccept.value = 'application/json';
        mainLabel.value = 'FHIR/JSON-File';
        break;
    case 'GENERIC':
        mainAccept.value = 'text/csv';
        mainLabel.value = 'CSV-File';
        break;
    default:
        mainAccept .value = 'text/csv';
        mainLabel.value = 'CSV-File';
}



const main_file = ref();

const upload = () => {
    if (!main_file.value || !main_file.value.files || main_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No files selected', life: 10000 });
    } else {
        props.onUpload(main_file.value.files[0])
    }
};

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
