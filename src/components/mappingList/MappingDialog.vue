<template>
    <Dialog :visible="props.showMappingDialog" :style="{ width: '900px' }" :header="props.header" :modal="true"
        class="p-fluid" v-model="currentMapping">
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
                <StatusDropdown v-model="currentMapping.status" :required="true"
                    :invalid="submitted && !currentMapping.status" placeholder="Select a Status" />
                <small class="p-error" v-if="submitted && !currentMapping.status">Status is required.</small>
            </div>

            <div class="field" style="flex: 1;" v-if="projectStore.currentProjectDetails.equivalence_required">
                <label for="equivalence" class="mb-3">Equivalence</label>
                <EquivalenceDropdown v-model="currentMapping.equivalence" :required="true"
                    :invalid="submitted && !currentMapping.equivalence" placeholder="Select the equivalence" />
                <small class="p-error" v-if="submitted && !currentMapping.equivalence">Equivalence is required.</small>
            </div>
        </div>

        <div class="field" style="margin-top: 10px;">
            <label for="comment">Comment</label>
            <InputText id="comment" v-model="currentMapping.comment" required="false" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideMappingDialog" />
            <Button label="Save" icon="pi pi-check" text @click="saveMapping" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { useToast } from "primevue/usetoast";
import { useCreateMappingQuery, useUpdateMappingQuery } from '@/composables/queries/mapping-query';
import { useProjectStore } from '@/stores/project';
import { on_item_select_autocomplete } from '@/utils/autocomplete';
import type { CreateMapping } from '@/stores/mappings'
import { useToast } from "primevue/usetoast";

const projectStore = useProjectStore();
const toast = useToast();


const currentMapping = ref({
    equivalence: null,
    status: null,
});


// to specify the type of slotProps (copied from the primevue documentation)
// interface SlotProps {
//     option: any;
//     index: number;
// }

// input of the component
const props = defineProps({
    header: {
        type: String,
        required: true
    },
    showMappingDialog: {
        type: Boolean,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    },
    // project: {
    //     type: Object as PropType<Project>,
    //     required: true
    // },
    // field: {            // meaning or code
    //     type: String,
    //     required: true
    // },
    // roleId: {
    //     type: Number,
    //     required: true
    // },
    // 'item-select': {
    //     type: Function as PropType<(event: AutoCompleteItemSelectEvent) => void>,
    //     required: false
    // }
});

function saveMapping() {
    if (!projectStore.currentProjectDetails) {
        return;
    }
    this.$emit('update:submitted', true);

    // was tut das? muss das nicht abhängig von project einstellungen sein?
    if (!currentMapping.value.status || !currentMapping.value.equivalence) {
        return;
    }

    this.$emit('update:showMappingDialog', false);
    // mapping.value = {};
    // TODO
    console.log(currentMapping.value)
    transformedMappings.value.push(currentMapping.value);


    const saved_mapping: CreateMapping = {
        equivalence: currentMapping.value.equivalence,
        status: currentMapping.value.status,
        comment: currentMapping.value.comment,
        elements: [],
    };
    const { error, isFetching, isReady, state, execute } = useUpdateMappingQuery(projectStore.currentProjectDetails.id, saved_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping updated successfully', life: 5000 });
                // console.log(state);
                transformedMappings.value[index] = flattened_mapping;
                // mappingStore.updateMapping(updated_mapping);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    })

    currentMapping.value = {};
}

</script>