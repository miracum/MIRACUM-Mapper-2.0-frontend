<template>
    <div class="flex mt-4 gap-2 align-items-center">
        <Button v-if="main_file && main_file.files && main_file.files.length > 0" icon="pi pi-trash" severity="danger" @click="main_file.clear()" />
        <FileUpload ref="main_file" choose-label="CodeSystem-icd10gm-<version>.json *" mode="basic" accept="application/json" />
        <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggleMain" />
        <Popover ref="main_info" style="max-width: 75%">
            <p>Please select the main file that contains the concepts.</p>
            <p>It must be a JSON file according to the FHIR R4 standard.</p>
            <p>Typically the filename starts with "CodeSystem-icd10gm".</p>
            <Message severity="error" class="mt-3">Required</Message>
        </Popover>
    </div>
    <div class="flex mt-2 gap-2 align-items-center">
        <Button v-if="replace_by_file && replace_by_file.files && replace_by_file.files.length > 0" icon="pi pi-trash" severity="danger" @click="replace_by_file.clear()" />
        <FileUpload ref="replace_by_file" choose-label="ConceptMap-icd10gm-<version>.json *" mode="basic" accept="application/json" />
        <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggleReplaceBy" />
        <Popover ref="replace_by_info" style="max-width: 75%">
            <p>Please select the file that contains the replace by / map to hints for deleted concepts.</p>
            <p>It must be a JSON file according to the FHIR R4 standard.</p>
            <p>Typically the filename starts with "ConceptMap-icd10gm".</p>
            <Message severity="error" class="mt-3">Required</Message>
        </Popover>
    </div>
    <div class="flex mt-4">
        <Button label="Import" @click="upload" severity="success" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import Popover from 'primevue/popover';
import { useImportCodeSystemVersionIcdQuery } from '@/composables/queries/codesystem-query';
import type { GetCodeSystem, GetCodeSystemVersion } from '@/stores/codesystem';

const props = defineProps({
    codesystem: {
        type: Object as () => GetCodeSystem,
        required: true
    },
    version: {
        type: Object as () => GetCodeSystemVersion,
        required: true
    },
});

const emit = defineEmits<{
    (e: 'upload', uploading: boolean, uploaded: boolean, error: boolean): void
}>();

const toast = useToast();

const main_file = ref();
const replace_by_file = ref();

const upload = async () => {
    if (!main_file.value || !main_file.value.files || main_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No main file (CodeSystem-icd10gm-<version>.json) selected', life: 10000 });
    } else if (!replace_by_file.value || !replace_by_file.value.files || replace_by_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No replace by file (ConceptMap-icd10gm-<version>.json) selected', life: 10000 });
    } else {
        emit('upload', true, false, false);
        const {error, isFetching, isReady, execute} = await useImportCodeSystemVersionIcdQuery(props.codesystem.id, props.version.id, main_file.value.files[0], replace_by_file.value.files[0]);
        watch(isFetching, (newVal) => {
            if (!newVal) {
                if (isReady.value) {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 10000 });
                    emit('upload', false, true, false);
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: `Could not import Codesystem version: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                    emit('upload', false, false, true);
                }
            }
        });
        execute();
    }
};

const main_info = ref();
const toggleMain = (payload: MouseEvent) => {
    main_info.value.toggle(payload);
};

const replace_by_info = ref();
const toggleReplaceBy = (payload: MouseEvent) => {
    replace_by_info.value.toggle(payload);
};

</script>
