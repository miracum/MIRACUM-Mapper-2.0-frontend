<template>
    <CodeSystemForm submitLabel="Create Codesystem" :onCancel="onCancel" :onSubmit="onCreate" :onePanel=true>
        <CodeSystemPanel :codesystem="codesystem" :submitted="submitted" :edit=false />
    </CodeSystemForm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import CodeSystemForm from '@/components/codesystemviews/CodeSystemForm.vue';
import CodeSystemPanel from '@/components/codesystemviews/CodeSystemPanel.vue';
import { type CreateCodeSystem, useCodeSystemStore } from '@/stores/codesystem';
import { getCreateToastOptions } from '@/utils/popupOptions';

const submitted = ref(false);

const toast = useToast();
const router = useRouter();
const store = useCodeSystemStore();

const codesystem = ref<CreateCodeSystem>({
    name: '',
    type: 'GENERIC',
    uri: '',
    title: '',
    author: '',
    description: ''
});

const onCreate = () => {
    submitted.value = true;
    if (!codesystem.value.name || !codesystem.value.type || !codesystem.value.uri) {
        return;
    }

    const typeName = 'Codesystem';
    const { isFetching, error } = store.addCodeSystem(codesystem.value);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            toast.add(getCreateToastOptions(error, typeName, codesystem.value.name));
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