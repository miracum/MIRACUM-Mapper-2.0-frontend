<template>
    <CodeSystemForm v-if="locked" submitLabel="Done" :noCancel=true :onSubmit="onDone" :onePanel=true>
        <ImportVersionLockedPanel :status="lockedStatus" />
    </CodeSystemForm>
    <CodeSystemForm v-if="!locked" submitLabel="Done" :noCancel=true :onSubmit="onDone" :onePanel=false>
        <ImportVersionPanel :codesystem="cs!" :version="version!" :uploading="uploading" :uploaded="uploaded" :onUpload="onUpload" />
        <ImportVersionStatusPanel :status="status" />
    </CodeSystemForm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import CodeSystemForm from '@/components/codesystemviews/CodeSystemForm.vue';
import ImportVersionPanel from '@/components/codesystemviews/ImportVersionPanel.vue';
import ImportVersionLockedPanel from '@/components/codesystemviews/ImportVersionLockedPanel.vue';
import ImportVersionStatusPanel from '@/components/codesystemviews/ImportVersionStatusPanel.vue';
import { useGetImportStatusQuery, useImportCodeSystemVersionJsonQuery, useImportCodeSystemVersionQuery } from '@/composables/queries/codesystem-query';
import { type ImportStatus, useCodeSystemStore } from '@/stores/codesystem';

const props = defineProps({
    codeSystemId: {
        type: String,
        required: true,
    },
    versionId: {
        type: String,
        required: true,
    }
});


const toast = useToast();
const router = useRouter();
const store = useCodeSystemStore();

try {
    Number(props.codeSystemId);
} catch (e) {
    router.push('/codesystems');
}
const codeSystemId = Number(props.codeSystemId);

try {
    Number(props.versionId);
} catch (e) {
    router.push('/codesystems');
}
const versionId = Number(props.versionId);

const cs = store.getCodeSystem(codeSystemId);
if (!cs) {
    router.push('/codesystems');
}
const version = cs!.versions.find(v => v.id === versionId);
if (!version) {
    router.push('/codesystems');
}


const locked = ref(true);
const lockedStatus = ref<ImportStatus>({error: null, running: true, progress: 0});

const uploading = ref(false);
const startedProcessing = ref(false);
const uploaded = ref(false);
const status = ref<ImportStatus | null>(null);

function getInitialStatus() {
    const {error, isFetching, isReady, state, execute} = useGetImportStatusQuery();
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                lockedStatus.value = state.value;
                if (state.value.running) {
                    setTimeout(getInitialStatus, 1000);
                } else {
                    locked.value = false;
                }
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not get import status due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
}
getInitialStatus();

function getImportStatus() {
    const {error, isFetching, isReady, state, execute} = useGetImportStatusQuery();
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                if (startedProcessing.value) {
                    status.value = state.value;
                    if (state.value.running) {
                        setTimeout(getImportStatus, 1000);
                    } else {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'Codesystem version imported successfully', life: 10000 });
                        store.setVersionImported(codeSystemId, versionId);
                    }
                } else {
                    if (state.value.running) {
                        status.value = state.value;
                        startedProcessing.value = true;
                        uploaded.value = true;
                        setTimeout(getImportStatus, 1000);
                    } else {
                        setTimeout(getImportStatus, 1000);
                    }
                }
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not get import status due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
}



const onUpload = async (main_file: File) => {
    uploading.value = true;
    getImportStatus();
    switch (cs!.type) {
        case 'ICD_10_GM': {
            const {error, isFetching, isReady, execute} = await useImportCodeSystemVersionJsonQuery(codeSystemId, versionId, main_file);
            watch(isFetching, (newVal) => {
                if (!newVal) {
                    if (isReady.value) {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 10000 });
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: `Could not import Codesystem version due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                        router.push(`/codesystems/${codeSystemId}`);
                    }
                }
            });
            execute();
            break;
        }
        default: {
            const {error, isFetching, isReady, execute} = useImportCodeSystemVersionQuery(codeSystemId, versionId, main_file);
            watch(isFetching, (newVal) => {
                if (!newVal) {
                    if (isReady.value) {
                        toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully', life: 10000 });
                    } else {
                        toast.add({ severity: 'error', summary: 'Error', detail: `Could not import Codesystem version due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                        router.push(`/codesystems/${codeSystemId}`);
                    }
                }
            });
            execute();
        }
    }
}

const onDone = () => {
    router.push(`/codesystems/${codeSystemId}`);
}

</script>