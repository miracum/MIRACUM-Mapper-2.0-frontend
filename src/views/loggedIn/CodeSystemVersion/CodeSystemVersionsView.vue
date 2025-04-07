<template>
    <AddVersionDialog v-model:visible="addVisible" :code-system="cs!" />
    <EditVersionDialog v-model:visible="editVisible" :code-system="cs!" :version="selectedVersion" />
    <div>
        <div class="container-fluid">
            <main role="main" class="pb-3">
                <Panel>
                    <template #header>
                       <h1 class="text-2xl m-0">{{ codesystemName }} - Versions</h1>
                    </template>
                    <template #icons>
                        <div class="flex space-x-2">
                            <Button icon="pi pi-pencil" label="Edit codesystem" @click="editCodesystem(codeSystemId)" />
                        </div>
                    </template>
                    <DataTable :value="versions" stripedRows removableSort v-model:selection="selectedVersion">
                        <template #header>
                            <div class="flex justify-content-between">
                                <div style="display: flex; gap: 10px;">
                                    <Button label="Add" icon="pi pi-plus" severity="success" @click="addVersion" />
                                    <Button label="Edit" icon="pi pi-pencil" @click="editSelectedVersion()" 
                                        :disabled="!selectedVersion"
                                        v-tooltip.top="!selectedVersion ? 'Please select a version' : ''" />
                                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteSelectedVersion"
                                        :disabled="!selectedVersion"
                                        v-tooltip.top="!selectedVersion ? 'Please select a version' : ''" />
                                    <Button label="Import concepts" icon="pi pi-upload" severity="info" @click="importSelectedVersion"
                                        :disabled="!selectedVersion || selectedVersion.imported"
                                        v-tooltip.top="!selectedVersion || selectedVersion.imported ? 'Please select a version that is not already imported' : ''" />
                                </div>
                            </div>
                        </template>
                        <Column selectionMode="single" style="width: 3rem; border-right: 1px solid #e3e8f0" :exportable="false"></Column>
                        <Column field="version_name" header="Name"></Column>
                        <Column field="release_date" header="Release Date">
                        </Column>
                        <Column field="imported" header="Imported">
                            <template #body="slotProps">
                                <span v-if="slotProps.data.imported">Yes</span>
                                <span v-else>No</span>
                            </template>
                        </Column>
                    </DataTable>
                    <!-- This message is shown if there are no mappings to show. -->
                    <Message v-if="!hasVersions" severity="warn" :closable="false">No data to show yet</Message>
                </Panel>
            </main>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { computed, ref, watch } from 'vue';
import { type GetCodeSystemVersion, useCodeSystemStore } from '@/stores/codesystem';
import AddVersionDialog from './AddVersionDialog.vue';
import EditVersionDialog from './EditVersionDialog.vue';
import { getDeleteConfirmationOptions, getDeleteToastOptions } from '@/utils/popupOptions';

const props = defineProps({
    codeSystemId: {
        type: String,
        required: true,
    }
});

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const store = useCodeSystemStore();


try {
    Number(props.codeSystemId);
} catch (e) {
    router.push('/codesystems');
}
const codeSystemId = Number(props.codeSystemId);

let cs = store.getCodeSystem(codeSystemId);
if (!cs) {
    router.push('/codesystems');
}
const codesystemName = ref(cs!.name);

// computed property
const versions = store.getVersions(codeSystemId);

const selectedVersion = ref<GetCodeSystemVersion | undefined>(undefined);
const hasVersions = computed(() => versions.value.length > 0);

const editCodesystem = (codeSystemId: number) => {
  router.push(`/codesystems/${codeSystemId}/edit`);
};

const addVisible = ref(false);
const addVersion = () => {
  addVisible.value = true;
};

const editVisible = ref(false);
const editSelectedVersion = () => {
  if (selectedVersion.value) {
    editVisible.value = true;
  }
};
watch(() => editVisible, (newVal) => {
    if (!newVal) {
        selectedVersion.value = undefined;
    }
});

const deleteSelectedVersion = () => {
    if (selectedVersion.value) {
        const id = selectedVersion.value.id;
        const name = selectedVersion.value.version_name;
        const typeName = 'Version';
        confirm.require(getDeleteConfirmationOptions(typeName, name, () => {
            const { isFetching, error } = store.deleteVersion(codeSystemId, id);
            watch(isFetching, (newVal) => {
                if (!newVal) {
                    toast.add(getDeleteToastOptions(error, typeName, name));
                    if (!error.value) {
                        selectedVersion.value = undefined;
                    }
                }
            });
        }));
    }
};

const importSelectedVersion = () => {
  if (selectedVersion.value) {
    router.push(`/codesystems/${codeSystemId}/import/${selectedVersion.value.id}`);
  }
};

</script>

<style scoped>
.title {
  font-size: 24px;
  margin: 0;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}
</style>