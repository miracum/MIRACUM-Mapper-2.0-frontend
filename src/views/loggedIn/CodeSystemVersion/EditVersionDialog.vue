<template>
    <Dialog v-model:visible="localVisible" @update:visible="updateVisible" modal header="Edit Version">
        <div class="dialog-content">
            <span class="p-text-secondary block mb-5">Edit version {{ props.version ? props.version.version_name : '' }} of {{ props.codeSystem.name }}.</span>
            <FloatLabel variant="on" class="flex-item">
                <InputText id="version_name" v-model="version_name" :invalid="submitted && !version_name" />
                <label for="version_name">Name</label>
            </FloatLabel>
            <small class="p-error" v-if="submitted && !version_name">Name is required.</small>
        </div>

        <div class="buttons">
            <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
            <Button type="button" label="Save" @click="editVersion"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">

import { ref, watch, type PropType } from "vue";
import { useToast } from "primevue/usetoast";
import { useCodeSystemStore, type UpdateCodeSystemVersion, type GetCodeSystemVersion, type GetCodeSystem } from '@/stores/codesystem';
import { getUpdateToastOptions } from "@/utils/popupOptions";

const emit = defineEmits(['update:visible']);

const props = defineProps({
    visible: Boolean,
    codeSystem: {
        type: Object as () => GetCodeSystem,
        required: true
    },
    version: {
        type: Object as PropType<GetCodeSystemVersion | undefined>,
        required: true
    }
});

// Local state mirroring the prop
const localVisible = ref(props.visible);

// Watch for prop changes to update the local state
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});

const store = useCodeSystemStore();
const toast = useToast();

const version_name = ref(props.version?.version_name);
watch(() => props.version, (newVal) => {
    version_name.value = newVal?.version_name;
});
const submitted = ref(false);

function editVersion() {
    submitted.value = true;
    if (!version_name.value) {
        return;
    }

    if (!props.version) {
        return;
    }

    const version: UpdateCodeSystemVersion = {
        version_name: version_name.value,
        id: props.version.id,
    };

    version_name.value = '';
    submitted.value = false;

    const { isFetching, error } = store.updateVersion(props.codeSystem.id, version);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            toast.add(getUpdateToastOptions(error, 'Version', version.version_name));
            closeModal();
        }
    });
}

function closeModal() {
    emit('update:visible', false);
}

function updateVisible(value: boolean) {
    emit('update:visible', value);
}

</script>

<style scoped>
.dialog-content>*+* {
    margin-top: 1.5rem;
}

.flex-item {
    width: 100%;
}

.flex-item input {
    width: 100%;
}

.buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
}

.flex-row {
    display: flex;
    gap: 1rem;
}

.full-width {
    width: 100%;
}

.full-width>Textarea {
    width: 100%;
}

.p-error {
    display: block;
}
</style>