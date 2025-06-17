<template>
    <div class="flex mt-4">
        <FileUpload ref="main_file" choose-label="main file (.csv) *" mode="basic" accept="text/csv" />
    </div>
    <div class="flex mt-2">
        <FileUpload ref="replace_by_file" choose-label="replace by file (.csv)" mode="basic" accept="text/csv" />
    </div>
    <div class="flex mt-4">
        <Button label="Import" @click="upload" severity="secondary" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useImportCodeSystemVersionGenericQuery } from '@/composables/queries/codesystem-query';
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

const upload = () => {
    if (!main_file.value || !main_file.value.files || main_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No main file selected', life: 10000 });
    } else {
        emit('upload', true, false, false);
        let replace_by_file_file = null;
        if (replace_by_file.value && replace_by_file.value.files && replace_by_file.value.files.length > 0) {
            replace_by_file_file = replace_by_file.value.files[0];
        }
        const {error, isFetching, isReady, execute} = useImportCodeSystemVersionGenericQuery(props.codesystem.id, props.version.id, main_file.value.files[0], replace_by_file_file);
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

</script>
