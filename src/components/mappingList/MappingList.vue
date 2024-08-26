<template>
    <DataTable v-model:filters="filters" :value="transformedMappings" ref="dt" tableStyle="min-width: 50rem"
        removableSort sortMode="multiple" filterDisplay="menu" :globalFilterFields="globalFilterFields"
        responsiveLayout=" scroll" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" stateStorage="session"
        scrollable scrollHeight="1000px" :stateKey="`mappings-${props.project.id}`" v-model:editingRows="editingRows"
        v-model:selection="selectedMappings" :pt="{
            table: { style: 'min-width: 10' }, // TODO what does this do?
            column: {
                bodycell: ({ state }) => ({
                    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                })
            }
        }" :paginator="transformedMappings && transformedMappings.length > 0" :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} mappings">
        <template #header>
            <div class="flex justify-content-between" style="margin-bottom: 20px;">
                <div style="display: flex; gap: 10px;"> <!-- TODO gap: 5px; in styles -->
                    <h2 class="m-0">Mapping Table</h2>
                </div>
                <div style="display: flex; gap: 10px;">
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
                </div>
            </div>
            <div class="flex justify-content-between">
                <div style="display: flex; gap: 10px;"> <!-- TODO gap: 5px; in styles -->
                    <!-- <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" /> -->
                    <Button label="Add" icon="pi pi-plus" class="mr-2" severity="success" @click="openNewMapping" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                        :disabled="!selectedMappings || !selectedMappings.length" />
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div style="text-align:left">
                        <MultiSelect :modelValue="selectedColumns" :options="toggleColumns" optionLabel="header"
                            @update:modelValue="onToggle" display="chip" placeholder="Hidden Columns" />
                    </div>
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </div>
        </template>
        <ColumnGroup type="header">
            <Row>
                <Column selectionMode="multiple" style="width: 3rem; border-right: 1px solid #e3e8f0"
                    :exportable="false" :rowspan="2"></Column>
                <Column v-for="role in props.project.code_system_roles" :colspan="2" class="grid-column-right"
                    style="border-right: 1px solid #e3e8f0" :key="role.id">
                    <template #header>
                        <div style=" display: flex; gap: 5px;"> <!-- TODO gap: 5px; in styles -->
                            <CodeSystemRole :role="role" />
                        </div>
                    </template>
                </Column>
                <Column header="Status" v-if="props.project.status_required" :rowspan="2" field="status" sortable
                    class="grid-column-right">
                </Column>
                <Column header="Equivalence" v-if="props.project.equivalence_required" :rowspan="2" sortable
                    field="equivalence">
                </Column>
                <Column header="Comment" :rowspan="2" sortable field="comment" filterField="comment">
                    <template #body="{ data }">
                        {{ data.comment }}
                    </template>
                    <!-- <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                            placeholder="Search by comment" />
                    </template> -->
                </Column>
                <Column v-if="selectedColumns.some(col => col.field === 'created')" header="Created" :rowspan="2"
                    sortable field="created">
                </Column>
                <Column v-if="selectedColumns.some(col => col.field === 'modified')" header="Modified" :rowspan="2"
                    sortable field="modified">
                </Column>
                <Column :rowspan="2">
                </Column>
                <Column :rowspan="2">
                </Column>
            </Row>
            <Row>
                <template v-for="role in props.project.code_system_roles" :key="role.id">
                    <Column header="Code" :field="`code_${role.id}`" sortable></Column>
                    <Column header="Meaning" :field="`meaning_${role.id}`" sortable
                        style="border-right: 1px solid #e3e8f0"></Column>
                </template>
            </Row>
        </ColumnGroup>
        <Column selectionMode="multiple" style="width: 3rem; border-right: 1px solid #e3e8f0" :exportable="false">
        </Column>
        <template v-for="role in props.project.code_system_roles" :key="role.id">
            <Column :field="`code_${role.id}`" sortable>
                <template #editor="{ data, field }">
                    <ConceptAutoComplete :roleId="role.id" field="code"
                        @item-select="(event) => on_item_select_autocomplete(event.value, data, role.id)"
                        v-model="data[field]" />
                </template>
            </Column>
            <Column :field="`meaning_${role.id}`" sortable style="border-right: 1px solid #e3e8f0">
                <template #editor="{ data, field }">
                    <ConceptAutoComplete :roleId="role.id" field="meaning"
                        @item-select="(event) => on_item_select_autocomplete(event.value, data, role.id)"
                        v-model="data[field]" />
                </template>
            </Column>
        </template>
        <Column v-if="props.project.status_required" field="status" sortable>
            <template #body="{ data }">
                <StatusTag :value="data.status" />
            </template>
            <template #editor="{ data, field }">
                <StatusDropdown v-model="data[field]" />
            </template>
        </Column>
        <Column v-if="props.project.equivalence_required" field="equivalence" sortable>
            <template #body="{ data }">
                <EquivalenceTag :value="data.equivalence" />
            </template>
            <template #editor="{ data, field }">
                <EquivalenceDropdown v-model="data[field]" />
            </template>
        </Column>
        <Column field="comment" sortable class="grid-column-right">
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'created')" field="created" dataType="date" sortable>
            <template #body="{ data }">
                <DateFormat :value="data.created" />
            </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'modified')" field="modified" dataType="date" sortable>
            <template #body="{ data }">
                <DateFormat :value="data.modified" />
            </template>
        </Column>
        <Column :rowEditor="true" style="width: auto; margin:0; padding:0%" bodyStyle="text-align:center">
        </Column>
        <Column :exportable="false" style="width: auto;  margin: 0; padding: 0%">
            <template #body="slotProps">
                <Button icon="pi pi-pen-to-square" text rounded @click="openEditMapping(slotProps.data)" />
                <Button icon="pi pi-trash" text rounded severity="danger"
                    @click="confirmDeleteMapping(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

    <DeleteMappingDialog v-model:visible="deleteMappingDialog" :mappings="mappingsToDelete"
        :onDelete="onDeleteMapping" />

    <!-- TODO: in Mappingdialog Komponente verschieben-->
    <Dialog v-model:visible="mappingDialog" :style="{ width: '900px' }" header="Add new Mapping" modal class="p-fluid">
        <Fieldset legend="Code Systems" :toggleable="true">
            <template v-for="role in props.project.code_system_roles" :key="role.id">
                <div style="margin-top: 10px;">
                    <CodeSystemRole :role="role" />
                    <div class="field-container" style="display: flex;">
                        <div class="field col flex-column" style="flex: 1;">
                            <label :for="`code_${role.id}`">Code</label>
                            <ConceptAutoComplete v-model="currentMapping['code_' + role.id]" :roleId="role.id"
                                field="code"
                                @item-select="(event) => on_item_select_autocomplete(event.value, currentMapping, role.id)" />
                        </div>
                        <div class="field col flex-column" style="flex: 1;">
                            <label :for="`meaning_${role.id}`">Meaning</label>
                            <ConceptAutoComplete v-model="currentMapping['meaning_' + role.id]" :roleId="role.id"
                                field="meaning"
                                @item-select="(event) => on_item_select_autocomplete(event.value, currentMapping, role.id)" />
                        </div>
                    </div>
                </div>
            </template>
        </Fieldset>

        <div class="field-container" style="display: flex; gap: 10px; margin-top: 10px; width: 100%;">
            <div class="field col flex-column" style="flex: 1;" v-if="props.project.status_required">
                <label for="status">Status</label>
                <StatusDropdown v-model="currentMapping.status" :required="true"
                    :invalid="submitted && !currentMapping.status" placeholder="Select a Status" />
                <small class="p-error" v-if="submitted && !currentMapping.status">Status is required.</small>
            </div>

            <div class="field col flex-column" style="flex: 1;" v-if="props.project.equivalence_required">
                <label for="equivalence">Equivalence</label>
                <EquivalenceDropdown v-model="currentMapping.equivalence" :required="true"
                    :invalid="submitted && !currentMapping.equivalence" placeholder="Select the equivalence" />
                <small class="p-error" v-if="submitted && !currentMapping.equivalence">Equivalence is required.</small>
            </div>
        </div>

        <div class="field col flex-column">
            <label for="comment">Comment</label>
            <InputText id="comment" v-model="currentMapping.comment" required="false" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideMappingDialog" />
            <Button label="Save" icon="pi pi-check" text @click="saveMapping" />
        </template>
    </Dialog>

    <Message v-if="props.mappings.length === 0" severity="warn" :closable="false">No data to show yet</Message>
</template>

<script setup lang='ts'>
import type { ProjectDetails } from '@/stores/project';
import type { Mapping, UpdateMapping } from '@/stores/mappings'; // , CreateMapping
import { ref, watch } from 'vue';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { useUpdateMappingQuery } from '@/composables/queries/mapping-query';
import StatusTag from '../tags/StatusTag.vue';
import EquivalenceTag from '../tags/EquivalenceTag.vue';
import StatusDropdown from '@/components/dropdowns/StatusDropdown.vue';
import EquivalenceDropdown from "@/components/dropdowns/EquivalenceDropdown.vue"
import DateFormat from '../DateFormat.vue';
import CodeSystemRole from './CodeSystemRole.vue';
import ConceptAutoComplete from '@/components/autocomplete/ConceptAutoComplete.vue';
import { on_item_select_autocomplete } from '@/utils/autocomplete';


// const updateData = (data, field, value) {
//     data[field] = value.meaning;
//     data[`meaning_${value.roleId}`] = value.meaning; // Update the meaning field
//     data[`id_${value.roleId}`] = value.id; // Update the id field
// };

const toast = useToast();

const props = defineProps({
    mappings: {
        type: Array as () => Mapping[],
        required: true
    },
    project: {
        type: Object as () => ProjectDetails,
        required: true
    },
    // mappings: Mapping[],
    // project: ProjectDetails,
    loading: Boolean
});

const mappingDialog = ref(false);
const submitted = ref(false);
const currentMapping = ref({
    equivalence: null,
    status: null,
});

const openNewMapping = () => {
    currentMapping.value = {
        equivalence: null,
        status: null,
    };
    submitted.value = false;
    mappingDialog.value = true;
};

const hideMappingDialog = () => {
    mappingDialog.value = false;
    submitted.value = false;
};

const saveMapping = () => {
    submitted.value = true;

    // was tut das? muss das nicht abhängig von project einstellungen sein?
    if (!currentMapping.value.status || !currentMapping.value.equivalence) {
        return;
    }

    mappingDialog.value = false;
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
    const { error, isFetching, isReady, state, execute } = useUpdateMappingQuery(props.project.id, saved_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping updated successfully', life: 5000 });
                // console.log(state);
                transformedMappings.value[index] = flattened_mapping;
                // mappingStore.updateMapping(updated_mapping);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 5000 });
            }
        }
    })

    currentMapping.value = {};

}


const openEditMapping = (mapping) => {
    // TODO differenciate between add and edit dialog
    mapping.value = { ...mapping };
    mappingDialog.value = true;
};

const toggleColumns = ref([
    { field: 'created', header: 'Created' },
    { field: 'modified', header: 'Modified' },
]);

const selectedColumns = ref([]);

const onToggle = (val) => {
    selectedColumns.value = toggleColumns.value.filter(col => val.includes(col));
};

const selectedMappings = ref();

const mappingsToDelete = ref([]);

const deleteMappingDialog = ref(false);

const confirmDeleteMapping = (flattened_mapping: any) => {
    mappingsToDelete.value = [flattened_mapping];
    deleteMappingDialog.value = true;
};

const confirmDeleteSelected = () => {
    mappingsToDelete.value = selectedMappings.value;
    deleteMappingDialog.value = true;
};

const onDeleteMapping = (mappings: Object[]) => {
    mappingsToDelete.value = [];
    transformedMappings.value = transformedMappings.value.filter(val => !mappings.includes(val));
};

// TODO mapping is of the type that was produced by the flattening process
function updateMapping(flattened_mapping: any, index: number) {
    let updated_mapping: UpdateMapping = {
        id: flattened_mapping.id,
        equivalence: flattened_mapping.equivalence,
        status: flattened_mapping.status,
        comment: flattened_mapping.comment,
        elements: [],
    };

    for (let i = 0; i < props.project.code_system_roles.length; i++) {
        const code_system_role_id = props.project.code_system_roles[i].id;
        if (flattened_mapping[`id_${code_system_role_id}`] != null) {
            updated_mapping.elements!.push({
                concept: flattened_mapping[`id_${code_system_role_id}`],
                codeSystemRole: code_system_role_id
            });
        }
    }

    console.log("log from update_mapping");
    console.log(updated_mapping);

    const { error, isFetching, isReady, state, execute } = useUpdateMappingQuery(props.project.id, updated_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping updated successfully', life: 5000 });
                // console.log(state);
                transformedMappings.value[index] = flattened_mapping;
                // mappingStore.updateMapping(updated_mapping);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 5000 });
            }
        }
    });
    execute();
}

const dt = ref();

const exportCSV = () => {
    dt.value.exportCSV();
};

// const emptyRow = ref(new Array(1));

const transformedMappings = ref(flattenMappings(props.mappings, props.project.code_system_roles));
// const columns = generateColumns(props.project.code_system_roles);

function flattenMappings(mappings: Mapping[], roles: CodeSystemRole[]): any[] {
    const transformedMappings: any = [];
    mappings.forEach(mapping => {
        const flattened: any = {
            comment: mapping.comment,
            status: mapping.status,
            equivalence: mapping.equivalence,
            id: mapping.id,
            created: new Date(mapping.created),
            modified: new Date(mapping.modified)
        };

        roles.forEach(role => {
            const element: FullElement | undefined = mapping.elements.find(el => el.codeSystemRole === role.id);
            if (element) {
                flattened[`code_${role.id}`] = element.concept.code;
                flattened[`meaning_${role.id}`] = element.concept.meaning;
                flattened[`id_${role.id}`] = element.concept.id;
            } else {
                flattened[`code_${role.id}`] = '';
                flattened[`meaning_${role.id}`] = '';
                flattened[`id_${role.id}`] = null;
            }
        })
        transformedMappings.push(flattened);
    });

    return transformedMappings;
}

const filters = ref();

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        // 'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        // representative: { value: null, matchMode: FilterMatchMode.IN },
        // date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        // balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        // status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        // activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};


// TODO when filtering for status or equivalence, filter for the label, not the value
const globalFilterFields: string[] = [
    'status',
    'equivalence',
    'comment',
    ...props.project.code_system_roles.flatMap(role => [`code_${role.id}`, `meaning_${role.id}`])
];

const editingRows = ref([]);

const onRowEditSave = (event: any) => {
    let { newData, index } = event;
    console.log("log from onroweditsave");
    console.log(newData);
    updateMapping(newData, index);
    //ransformedMappings.value[index] = newData;
}

</script>

<style scoped>
/* CSS to show the row editor column only on row hover */
/* .data-table-row:hover .show-on-row-hover {
    display: block;
} */

.flex {
    display: flex;
    flex-direction: row;
    /* Ensure flex items are in a row */
    justify-content: space-between;
    /* Space between items */
    align-items: center;
    /* Align items vertically */
    width: 100%;
    /* Ensure the container takes full width */
}

.grid-column-right {
    border-right: 1px solid #bebebe;
}

.flex-column {
    display: flex;
    flex-direction: column;
}

.align-left {
    align-items: flex-start;
}
</style>