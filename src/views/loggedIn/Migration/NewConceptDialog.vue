<template>
    <Dialog v-model:visible="localVisible" modal :style="{ width: '900px' }" header="Choose new concept" class="p-fluid" @hide="closeDialog">
        <div class="mt-3">
            <FloatLabel variant="on">
                <InputText id="code" v-model="code" class="w-full" />
                <label for="code">Code</label>
            </FloatLabel>
        </div>
        <div class="mt-3">
            <FloatLabel variant="on">
                <InputText id="meaning" v-model="meaning" class="w-full" />
                <label for="meaning">Meaning</label>
            </FloatLabel>
        </div>
        <div class="mt-3">
            <div class="mb-3">Search results</div>
            <Listbox v-model="selectedConcept" :options="concepts" class="w-full" listStyle="max-height:250px">
                <template #option="slotProps">
                    <div>
                        <div>
                            <span class="me-3" style="font-weight: bold;">{{ slotProps.option.code }}</span>
                            <ConceptStatusTag :value="slotProps.option.status" />
                        </div>
                        <div>{{ slotProps.option.meaning  }}</div>
                        <div v-if="slotProps.option.description" class="text-sm" style="color: gray;">
                            {{ slotProps.option.description }}
                        </div>
                    </div>
                </template>
                <template #empty>
                    No results found
                </template>
            </Listbox>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/project';
import { useGetConceptsQuery } from '@/composables/queries/mapping-query';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    roleId: {
        type: Number,
        required: true
    },
    conceptIndex: {
        type: Number,
        required: true
    },
    mappingIndex: {
        type: Number,
        required: true
    }
});

const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void
    (e: 'concept-select', conceptIndex: number, mappingIndex: number,  concept: any): void
}>();

const toast = useToast();
const projectStore = useProjectStore();

const localVisible = ref(props.visible);
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});
watch(localVisible, (newVal) => {
    emit('update:visible', newVal);
});

const code = ref('');
const meaning = ref('');
watch(code, (newVal) => {
    if (newVal.length != 0) {
        searchConcept(newVal.toLowerCase(), 'code');
        meaning.value = '';
    }
    if (newVal.length == 0 && meaning.value.length == 0) {
        concepts.value = null;
    }

});
watch(meaning, (newVal) => {
    if (newVal.length != 0) {
        searchConcept(newVal.toLowerCase(), 'meaning');
        code.value = '';
    }
    if (newVal.length == 0 && code.value.length == 0) {
        concepts.value = null;
    }
});

const concepts = ref();
const selectedConcept = ref();
watch(selectedConcept, (newVal) => {
    if (newVal) {
        emit('concept-select', props.conceptIndex, props.mappingIndex, newVal);
        localVisible.value = false;
    }
});

const searchConcept = (text: string, type: string) => {
    let code = null;
    let meaning = null;
    if (type === 'code') {
        code = text;
    } else if (type === 'meaning') {
        meaning = text;
    }
    if (!projectStore.currentLookupCodeSystemRoleIds) {
        return;
    }
    const currentCodeSystemRoleIds = projectStore.currentLookupCodeSystemRoleIds[props.roleId];
    const { state, isFetching, error, execute } = useGetConceptsQuery(currentCodeSystemRoleIds.codeSystemId, currentCodeSystemRoleIds.nextCodeSystemVersionId!, code, meaning, 10);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (!error.value) {
                concepts.value = state.value;
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not fetch concepts due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
}

function closeDialog() {
    localVisible.value = false;
    resetForm();
}

function resetForm() {
    code.value = '';
    meaning.value = '';
    selectedConcept.value = null;
    concepts.value = null;
}

</script>