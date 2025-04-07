<template>
    <CodeSystemForm submitLabel="Save Codesystem" :onCancel="onCancel" :onSubmit="onSave" :onePanel=true>
        <CodeSystemPanel :codesystem="codesystem" :submitted="submitted" :edit=true />
    </CodeSystemForm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import CodeSystemForm from '@/components/codesystemviews/CodeSystemForm.vue';
import CodeSystemPanel from '@/components/codesystemviews/CodeSystemPanel.vue';
import { type UpdateCodeSystem, useCodeSystemStore } from '@/stores/codesystem';
import { getUpdateToastOptions } from '@/utils/popupOptions';

const props = defineProps({
    codeSystemId: {
        type: String,
        required: true,
    }
});

const submitted = ref(false);

const toast = useToast();
const router = useRouter();
const store = useCodeSystemStore();

try {
    Number(props.codeSystemId);
} catch (e) {
    router.push('/codesystems');
}
const codeSystemId = Number(props.codeSystemId);

const cs = store.getCodeSystem(codeSystemId);
if (!cs) {
    router.push('/codesystems');
}

const codesystem = ref<UpdateCodeSystem>({
    id: cs!.id,
    name: cs!.name,
    type: cs!.type,
    uri: cs!.uri,
    title: cs!.title,
    author: cs!.author,
    description: cs!.description,
});

const onSave = () => {
    submitted.value = true;
    if (!codesystem.value.name || !codesystem.value.type || !codesystem.value.uri) {
        return;
    }

    const typeName = 'Codesystem';
    const { error, isFetching } = store.updateCodeSystem(codesystem.value);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            toast.add(getUpdateToastOptions(error, typeName, codesystem.value.name));
            if (!error.value) {
                router.push('/codesystems');
            }
        }
    })
}

const onCancel = () => {
    router.push('/codesystems');
}

</script>