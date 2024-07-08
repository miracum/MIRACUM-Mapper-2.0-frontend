<template>
    <!--  -->
    <DataTable v-model:filters="filters" :value="transformedMappings" ref="dt" tableStyle="min-width: 50rem"
        removableSort sortMode="multiple" filterDisplay="menu" :globalFilterFields="globalFilterFields"
        responsiveLayout=" scroll" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" stateStorage="session"
        scrollable scrollHeight="1000px" :stateKey="`mappings-${props.project.id}`" v-model:editingRows="editingRows"
        v-model:selection="selectedMappings" :pt="{
            table: { style: 'min-width: 10' },
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
            <div class="flex justify-content-between">
                <div style="display: flex; gap: 10px;"> <!-- TODO gap: 5px; in styles -->
                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
                    <div style="text-align:left">
                        <MultiSelect :modelValue="selectedColumns" :options="toggleColumns" optionLabel="header"
                            @update:modelValue="onToggle" display="chip" placeholder="Hidden Columns" />
                    </div>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                        :disabled="!selectedMappings || !selectedMappings.length" />
                </div>
                <div style="display: flex; gap: 10px;">
                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
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
                    style="border-right: 1px solid #e3e8f0">
                    <template #header>
                        <div style=" display: flex; gap: 5px;"> <!-- TODO gap: 5px; in styles -->
                            <Tag :value="role.type" :severity="getRole(role.type)" />
                            <span class="name">{{ role.system.name }}</span>
                            <span class="code p-text-secondary">{{ role.name }}</span>
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
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                            placeholder="Search by comment" />
                    </template>
                </Column>
                <Column v-if="selectedColumns.some(col => col.field === 'created')" header="Created" :rowspan="2"
                    sortable field="created">
                </Column>
                <Column v-if="selectedColumns.some(col => col.field === 'modified')" header="Modified" :rowspan="2"
                    sortable field="modified">
                </Column>
            </Row>
            <Row>
                <template v-for="role in props.project.code_system_roles">
                    <Column header="Code" :field="`code_${role.id}`" sortable></Column>
                    <Column header="Meaning" :field="`meaning_${role.id}`" sortable
                        style="border-right: 1px solid #e3e8f0"></Column>
                </template>
            </Row>
        </ColumnGroup>
        <Column selectionMode="multiple" style="width: 3rem; border-right: 1px solid #e3e8f0" :exportable="false">
        </Column>
        <template v-for="role in props.project.code_system_roles">
            <Column :field="`code_${role.id}`" sortable>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column :field="`meaning_${role.id}`" sortable style="border-right: 1px solid #e3e8f0">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
        </template>
        <Column v-if="props.project.status_required" field="status" sortable>
            <template #body="{ data }">
                <Tag :value="statuses[data.status]" :severity="getStatus(data.status)" />
            </template>
            <template #editor="{ data, field }">
                <Dropdown v-model="data[field]" :options="statusOptions" optionLabel="label" optionValue="value"
                    placeholder="Select a Status">
                    <template #option="{ option }">
                        <Tag :value="option.label" :severity="getStatus(option.value)" />
                    </template>
                </Dropdown>
            </template>

        </Column>
        <Column v-if="props.project.equivalence_required" field="equivalence" sortable>
            <template #body="{ data }">
                <Tag :value="equivalences[data.equivalence]" :severity="getEquivalence(data.equivalence)" />
            </template>
            <template #editor="{ data, field }">
                <Dropdown v-model="data[field]" :options="equivalenceOptions" optionLabel="label" optionValue="value"
                    placeholder="Select an Equivalence">
                    <template #option="{ option }">
                        <Tag :value="option.label" :severity="getEquivalence(option.value)" />
                    </template>
                </Dropdown>
            </template>
        </Column>
        <Column field="comment" sortable class="grid-column-right">
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
        </Column>
        <!--<Column field="created" dataType="date" sortable style="border-right: 1px solid #000000">-->
        <Column v-if="selectedColumns.some(col => col.field === 'created')" field="created" dataType="date" sortable>
            <template #body="{ data }">
                {{ formatDate(data.created) }}
            </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'modified')" field="modified" dataType="date" sortable>
            <template #body="{ data }">
                {{ formatDate(data.modified) }}

            </template>
        </Column>
        <!-- <Column :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
                <Button :rowEditor="true" icon="pi pi-pencil" outlined rounded class="mr-2" />
            </template>
        </Column> -->
        <Column :rowEditor="true" style="width: auto; margin:0; padding:0%" bodyStyle="text-align:center">
        </Column>
        <Column :exportable="false" style="width: auto;  margin: 0; padding: 0%">
            <template #body="slotProps">
                <Button icon="pi pi-trash" outlined rounded severity="danger"
                    @click="confirmDeleteMapping(slotProps.data)" />
            </template>
        </Column>
        <!-- <template v-if="props.mappings.length > 0" v-for="(col, index) in columns" :key="index">
                <Column :field="col.field" sortable>
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                </template>
                </Column>
            </template> -->
        <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
            </Column> -->
    </DataTable>
    <Dialog v-model:visible="deleteMappingDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <!--<span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>-->
            <span>Are you sure you want to delete this mapping?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteMappingDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteMapping" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteMappingsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span> Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteMappingsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedMappings" />
        </template>
    </Dialog>

    <Message v-if="props.mappings.length === 0" severity="warn" :closable="false">No data to show yet</Message>
</template>

<script setup lang='ts'>
import { useProjectStore } from '@/stores/project';
import { useMappingStore } from '@/stores/mappings';
import { useDeleteMappingQuery } from '@composables/queries/mapping-query'
import type { ProjectDetails, Mapping, FullElement, CodeSystemRole } from '@/client/types.gen';
import { ref, computed, watch } from 'vue';
import Ref from 'vue';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from "primevue/usetoast";

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

const toggleColumns = ref([
    { field: 'created', header: 'Created' },
    { field: 'modified', header: 'Modified' },
]);

const selectedColumns = ref([]);

const onToggle = (val) => {
    selectedColumns.value = toggleColumns.value.filter(col => val.includes(col));
};

const selectedMappings = ref();

const deleteMappingDialog = ref(false);
const deleteMappingsDialog = ref(false);

const currentMappingToDelete: Ref<Mapping> = ref<Mapping>({});
const confirmDeleteMapping = (mapping: Mapping) => {
    currentMappingToDelete.value = mapping;
    deleteMappingDialog.value = true;
};

const deleteMapping = () => {

    const { state, isReady, isFetching, error, execute } = useDeleteMappingQuery(projectStore.currentProject?.id, currentMappingToDelete.id);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project successfully deleted', life: 5000 });
                mappingStore.deleteMapping(currentMappingToDelete.id);
            } else {
                // TODO this is a bad error message. Define error codes in the backend and translate them to meaningful ui errors. E.g. if the user isnt in the right scope, provide a unsufficient user permissions error instead of the current api error
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not delete Project due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 5000 });
                console.log(error.value?.message.toString());
            }
        }
    });
    execute();

    deleteMappingDialog.value = false;
};

const dt = ref();

const exportCSV = () => {
    dt.value.exportCSV();
};

const emptyRow = ref(new Array(1));

const transformedMappings = ref(flattenMappings(props.mappings, props.project.code_system_roles));
const columns = generateColumns(props.project.code_system_roles);

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
            flattened[`code_${role.id}`] = '';
            flattened[`meaning_${role.id}`] = '';

            const element: FullElement | undefined = mapping.elements.find(el => el.codeSystemRole === role.id);
            if (element) {
                flattened[`code_${role.id}`] = element.concept.code;
                flattened[`meaning_${role.id}`] = element.concept.meaning;
            }
        })
        transformedMappings.push(flattened);
    });

    return transformedMappings;
}

function generateColumns(codeSystemRoles: CodeSystemRole[]): any[] {
    const columns = [];

    for (let i = 0; i < codeSystemRoles.length; i++) {
        columns.push({ field: `code_${codeSystemRoles[i].id}`, header: 'Code' });
        columns.push({ field: `meaning_${codeSystemRoles[i].id}`, header: 'Meaning' });
    }

    if (props.project.status_required) {
        columns.push({ field: 'status', header: 'Status' });
    }
    if (props.project.equivalence_required) {
        columns.push({ field: 'equivalence', header: 'Equivalence' });
    }
    columns.push({ field: 'comment', header: 'Comment' });

    return columns;
}

const confirmDeleteSelected = () => {
    deleteMappingsDialog.value = true;
};

const deleteSelectedMappings = () => {
    transformedMappings.value = transformedMappings.value.filter(val => !transformedMappings.value.includes(val));
    deleteMappingsDialog.value = false;
    selectedMappings.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const formatDate = (value: Date) => {
    return value.toLocaleDateString('en-US', {
        minute: '2-digit',
        hour: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

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


function getOptions(obj: any) {
    return Object.keys(obj).map(key => ({ label: obj[key], value: key }));
}


// TODO when filtering for status or equivalence, filter for the label, not the value
const globalFilterFields: string[] = [
    'status',
    'equivalence',
    'comment',
    ...props.project.code_system_roles.flatMap(role => [`code_${role.id}`, `meaning_${role.id}`])
];

// console.log(globalFilterFields);

// TODO put this in a single map, e.g. active: { label: 'Active', severity: 'success' }
const statuses = { 'active': "Active", 'inactive': "Inactive", 'pending': "Pending" };
const statusOptions = ref(getOptions(statuses));
const getStatus = (status: string) => {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'danger';
        // case 'new':
        //     return 'info';
        case 'pending':
            return 'warning';
        default:
            return 'info';
    }
}

const equivalences = { 'related-to': 'Related To', 'equivalent': 'Equivalent', 'source-is-narrower-than-target': 'Narrower', 'source-is-broader-than-target': 'Broader', 'not-related': 'Not Related' };
const equivalenceOptions = ref(getOptions(equivalences));
const getEquivalence = (equivalence: string) => {
    switch (equivalence) {
        case 'related-to':
            return 'info';
        case 'equivalent':
            return 'success';
        case 'source-is-narrower-than-target':
            return 'warning';
        case 'source-is-broader-than-target':
            return 'warning';
        case 'not-related':
            return 'danger';
        default:
            return 'info';
    }
}

const roles = ref(['source', 'target']);
const getRole = (role: string) => {
    switch (role) {
        case 'source':
            return 'info';
        case 'target':
            return 'info';
        default:
            return 'info';
    }
}

const editingRows = ref([]);

const onRowEditSave = (event: any) => {
    let { newData, index } = event;
    transformedMappings.value[index] = newData;
}

const projectStore = useProjectStore();
const mappingStore = useMappingStore();

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
</style>