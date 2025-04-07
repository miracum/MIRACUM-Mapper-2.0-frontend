<template>
    <Dialog v-model:visible="localVisible" @update:visible="updateVisible" modal header="Add Version">
        <div class="dialog-content">
            <span class="p-text-secondary block mb-5">Add a new version to {{ codeSystem.name }}. The concepts can be imported afterwards.</span>
            <FloatLabel variant="on" class="flex-item">
                <InputText id="version_name" v-model="version_name" :invalid="submitted && !version_name" />
                <label for="version_name">Name</label>
            </FloatLabel>
            <small class="p-error" v-if="submitted && !version_name">Name is required.</small>
            <FloatLabel variant="on" class="flex-item">
                <DatePicker id="release_date" v-model="release_date" date-format="yy-mm-dd" :invalid="submitted && !release_date"/>
                <label for="release_date">Release Date</label>
            </FloatLabel>
            <small class="p-error" v-if="submitted && !release_date">Release Date is required.</small>
        </div>

        <div class="buttons">
            <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
            <Button type="button" label="Save" @click="addVersion"></Button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">

import { ref, watch } from "vue";
import DatePicker from 'primevue/datepicker';
import { useToast } from "primevue/usetoast";
import { useCodeSystemStore, type BaseCodeSystemVersion, type GetCodeSystem } from '@/stores/codesystem';
import { getCreateToastOptions } from "@/utils/popupOptions";

const emit = defineEmits(['update:visible']);

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    codeSystem: {
        type: Object as () => GetCodeSystem,
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

const version_name = ref('');
const release_date = ref<Date | null>(null);
const submitted = ref(false);

function addVersion() {
    submitted.value = true;
    if (!version_name.value || !release_date.value) {
        return;
    }

    const version: BaseCodeSystemVersion = {
        version_name: version_name.value,
        release_date: `${release_date.value?.getFullYear()}-${(release_date.value?.getMonth()! + 1).toString().padStart(2, '0')}-${release_date.value?.getDate().toString().padStart(2, '0')}`
    };

    version_name.value = '';
    release_date.value = null;
    submitted.value = false;

    const typeName = 'Version';
    const { isFetching, error } = store.addVersion(props.codeSystem.id, version);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            toast.add(getCreateToastOptions(error, typeName, version.version_name));
            closeModal();
        }
    });
};

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