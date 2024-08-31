<template>
    <Dialog v-model:visible="localVisible" modal :style="{ width: '900px' }" :header="props.header" class="p-fluid">
        <Fieldset legend="Code Systems" :toggleable="true" v-if="projectStore.currentProjectDetails">
            <template v-for="role in projectStore.currentProjectDetails.code_system_roles" :key="role.id">
                <div style="margin-top: 10px;">
                    <CodeSystemRole :role="role" />
                    <div class="formgrid grid">
                        <div class="field col">
                            <label :for="`code_${role.id}`">Code</label>
                            <ConceptAutoComplete v-model="currentMapping['code_' + role.id]" :roleId="role.id"
                                field="code"
                                @item-select="(event) => on_item_select_autocomplete(event.value, currentMapping, role.id)" />
                        </div>
                        <div class="field col">
                            <label for="`meaning_${role.id}`">Meaning</label>
                            <ConceptAutoComplete v-model="currentMapping['meaning_' + role.id]" :roleId="role.id"
                                field="meaning"
                                @item-select="(event) => on_item_select_autocomplete(event.value, currentMapping, role.id)" />
                        </div>
                    </div>
                </div>
            </template>
        </Fieldset>

        <div class="field-container" style="display: flex; gap: 10px; margin-top: 10px; width: 100%;"
            v-if="projectStore.currentProjectDetails">

            <div class="field" style="flex: 1;" v-if="projectStore.currentProjectDetails.status_required">
                <label for="status" class="mb-3">Status</label>
                <StatusSelect v-model="currentMapping.status" :required="true"
                    :invalid="submitted && !currentMapping.status" placeholder="Select a Status" />
                <small class="p-error" v-if="submitted && !currentMapping.status">Status is required.</small>
            </div>

            <div class="field" style="flex: 1;" v-if="projectStore.currentProjectDetails.equivalence_required">
                <label for="equivalence" class="mb-3">Equivalence</label>
                <EquivalenceSelect v-model="currentMapping.equivalence" :required="true"
                    :invalid="submitted && !currentMapping.equivalence" placeholder="Select the equivalence" />
                <small class="p-error" v-if="submitted && !currentMapping.equivalence">Equivalence is required.</small>
            </div>

        </div>

        <div class="field" style="margin-top: 10px;">
            <label for="comment">Comment</label>
            <InputText id="comment" v-model="currentMapping.comment" required="false" />
        </div>

        <template #footer>
            <!-- <Button label="Cancel" icon="pi pi-times" text @click="hideMappingDialog" /> -->
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
            <Button label="Save" icon="pi pi-check" text @click="submitMapping" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { useProjectStore } from '@/stores/project';
import { on_item_select_autocomplete } from '@/utils/autocomplete';

// input of the component
const props = defineProps({
    header: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        required: true
    },
    mapping: {
        type: Object,
        required: false
    },
    saveMapping: {
        type: Function as PropType<(mapping: any) => void>,
        required: true
    }
});

const projectStore = useProjectStore();


// handle visibility of the dialog
const emit = defineEmits(['update:visible']);
const localVisible = ref(props.visible);
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
});
watch(localVisible, (newVal) => {
    emit('update:visible', newVal);
});
function closeDialog() {
    submitted.value = false;
    localVisible.value = false;
}

const currentMapping = ref({
    equivalence: null,
    status: null,
});
if (props.mapping) {
    currentMapping.value = props.mapping;
}
watch(() => props.mapping, (newVal) => {
    if (newVal) {
        currentMapping.value = { ...newVal };
    }
});

const submitted = ref(false);

const submitMapping = () => {
    submitted.value = true;
    if ((projectStore.currentProjectDetails?.equivalence_required && !currentMapping.value.equivalence) || (projectStore.currentProjectDetails?.status_required && !currentMapping.value.status)) {
        return;
    }
    localVisible.value = false;
    props.saveMapping(currentMapping.value);
    currentMapping.value = {
        equivalence: null,
        status: null,
    };
};

</script>