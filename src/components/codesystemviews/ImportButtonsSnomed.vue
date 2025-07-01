<template>
    <div class="flex mt-4 gap-2 align-items-center">
        <Button v-if="concept_file && concept_file.files && concept_file.files.length > 0" icon="pi pi-trash" severity="danger" @click="concept_file.clear()" />
        <FileUpload ref="concept_file" choose-label="sct2_Concept_Snapshot_&lt;version&gt;.txt *" mode="basic" accept="text/plain" />
        <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggleConcept" />
        <Popover ref="concept_info" style="max-width: 75%">
            <p>Please select the concept file from the SNOMED CT Snapshot.</p>
            <p>Directory: "Snapshot/Terminology"</p>
            <p>Filename: "sct2_Concept_Snapshot_&lt;version&gt;.txt"</p>
            <Message severity="error" class="mt-3">Required</Message>
        </Popover>
    </div>
    <div class="flex mt-2 gap-2 align-items-center">
        <Button v-if="description_file && description_file.files && description_file.files.length > 0" icon="pi pi-trash" severity="danger" @click="description_file.clear()" />
        <FileUpload ref="description_file" choose-label="sct2_Description_Snapshot_&lt;version&gt;.txt *" mode="basic" accept="text/plain" />
        <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggleDescription" />
        <Popover ref="description_info" style="max-width: 75%">
            <p>Please select the description file from the SNOMED CT Snapshot.</p>
            <p>Directory: "Snapshot/Terminology"</p>
            <p>Filename: "sct2_Description_Snapshot_&lt;version&gt;.txt"</p>
            <Message severity="error" class="mt-3">Required</Message>
        </Popover>
    </div>
    <div class="flex mt-2 gap-2 align-items-center">
        <Button v-if="association_file && association_file.files && association_file.files.length > 0" icon="pi pi-trash" severity="danger" @click="association_file.clear()" />
        <FileUpload ref="association_file" choose-label="der2_cRefset_AssociationSnapshot_&lt;version&gt;.txt *" mode="basic" accept="text/plain" />
        <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggleAssociation" />
        <Popover ref="association_info" style="max-width: 75%">
            <p>Please select the association file from the SNOMED CT Snapshot.</p>
            <p>Directory: "Snapshot/Refset/Content"</p>
            <p>Filename: "der2_cRefset_AssociationSnapshot_&lt;version&gt;.txt"</p>
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
import { useImportCodeSystemVersionSnomedQuery } from '@/composables/queries/codesystem-query';
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

const concept_file = ref();
const description_file = ref();
const association_file = ref();

const upload = () => {
    if (!concept_file.value || !concept_file.value.files || concept_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No concept file selected', life: 10000 });
    } else if (!description_file.value || !description_file.value.files || description_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No description file selected', life: 10000 });
    } else if (!association_file.value || !association_file.value.files || association_file.value.files.length === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No association file selected', life: 10000 });
    } else {
        emit('upload', true, false, false);
        const {error, isFetching, isReady, execute} = useImportCodeSystemVersionSnomedQuery(props.codesystem.id, props.version.id, concept_file.value.files[0], description_file.value.files[0], association_file.value.files[0]);
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

const concept_info = ref();
const toggleConcept = (payload: MouseEvent) => {
    concept_info.value.toggle(payload);
};

const description_info = ref();
const toggleDescription = (payload: MouseEvent) => {
    description_info.value.toggle(payload);
};

const association_info = ref();
const toggleAssociation = (payload: MouseEvent) => {
    association_info.value.toggle(payload);
};

</script>
