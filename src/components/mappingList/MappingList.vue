<template>
    <!-- DataTable, see https://primevue.org/datatable/ - Can be widely customized and has many inbuilt features like sorting, filtering, pagination, etc.-->
    <!-- This defines general information about the DataTable. -->
    <DataTable v-model:filters="filters" :value="transformedMappings" stripedRows ref="dt" :size="size.value"
        tableStyle="min-width: 50rem" removableSort sortMode="multiple" filterDisplay="row"
        :globalFilterFields="globalFilterFields" responsiveLayout=" scroll" editMode="row" dataKey="id"
        @row-edit-save="onRowEditSave" scrollable scroll-height="calc(100vh - 230px)" v-model:editingRows="editingRows"
        v-model:selection="selectedMappings" :pt="{
            table: { style: 'min-width: 10' },
            column: {
                bodycell: ({ state }) => ({
                    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                })
            }
        }" :paginator="transformedMappings && transformedMappings.length > 0" :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[10, 20, 50, 100, 500, 1000, 5000]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} mappings">
        <!-- Elements which are displayed at the top of the table can be defined here. It is used to provide elements like an export button, add or delete elements, apply filtering etc. -->
        <!-- Optionally the state of the table can be persisted (session, local) so the user doesn't has to select the filter over and over again when coming back to the table later.
         An option can be implemented to allow a user to save the state if he want to and then show a button to reset the view.-->
        <template #header> <!--  stateStorage="session" stateKey="`mappings-${props.project.id}`" -->
            <div class="flex justify-content-between">
                <div style="display: flex; gap: 10px;"> <!-- TODO gap: 5px; in styles -->
                    <Button label="Add" icon="pi pi-plus" class="mr-2" severity="success"
                        @click="showCreateMappingDialog = true"
                        :disabled="!userHasPermission(MappingCreatePermission, projectStore, authStore)"
                        v-tooltip.top="addButtonTooltip(MappingCreatePermission)" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                        :disabled="!userHasPermission(MappingDeletePermission, projectStore, authStore) || !selectedMappings || !selectedMappings.length"
                        v-tooltip.top="addButtonTooltip(MappingDeletePermission)" />
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <!-- <Button icon="pi pi-pencil" label="Edit project" @click="editProjectView(props.project.id)" /> -->
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                    <Button type="button" icon="pi pi-sliders-h" label="Table Options" @click="onPopUpToggle" />
                    <Popover ref="popUp">
                        <div class="flex flex-col gap-4 w-full">
                            <div>
                                <span class="font-medium block mb-2">Table style</span>
                                <SelectButton v-model="size" :options="sizeOptions" optionLabel="label"
                                    dataKey="label" />
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Project Role</span>
                                <Button text @click="permissionRoleDialog = true">
                                    <PermissionTag :value="projectStore.projectRole" v-if="projectStore.projectRole" />
                                </Button>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Adjust Columns</span>
                                <div style="text-align:left">
                                    <MultiSelect :modelValue="selectedColumns" :options="toggleColumns"
                                        optionLabel="header" @update:modelValue="onToggle" display="chip"
                                        placeholder="Hidden Columns" />
                                </div>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Clear All Filters</span>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                        @click="clearFilter()" />
                                </div>
                            </div>
                            <div>
                                <span class="font-medium block mb-2">Export Project Mappings</span>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
                                </div>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        </template>
        <!-- <template #empty> No customers found. </template> TODO
        <template #loading> Loading customers data. Please wait. </template> TODO -->

        <!-- This defines the header rows of the DataTable. The code systems should be a column which spans over the code and meaning columns so is has to be defined how many columns they span. This makes the use of ColumnGroups necessary -->
        <ColumnGroup type="header">
            <Row>
                <Column selectionMode="multiple" style="width: 3rem; border-right: 1px solid #e3e8f0"
                    :exportable="false" :rowspan="2"></Column>
                <Column v-for="role in props.project.code_system_roles" :colspan="2" class="grid-column-right"
                    style="border-right: 1px solid #e3e8f0" :key="role.id">
                    <template #header>
                        <div style=" display: flex; gap: 5px;">
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
        <!-- After defining the header rows, the content of the elements in the DataTable are defined -->
        <Column selectionMode="multiple" style="width: 3rem; border-right: 1px solid #e3e8f0" :exportable="false">
        </Column>
        <template v-for="role in props.project.code_system_roles" :key="role.id">
            <Column :field="`code_${role.id}`" :filterField="`code_${role.id}`" sortable>
                <template #editor="{ data, field }">
                    <ConceptAutoComplete :roleId="role.id" field="code"
                        @item-select="(event) => on_item_select_autocomplete(event.value, data, role.id)"
                        v-model="data[field]" @blur="validateFields(data, role.id)" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by code" class="filter-width-code" />
                </template>
            </Column>
            <Column :field="`meaning_${role.id}`" sortable style="border-right: 1px solid #e3e8f0">
                <template #editor="{ data, field }">
                    <ConceptAutoComplete :roleId="role.id" field="meaning"
                        @item-select="(event) => on_item_select_autocomplete(event.value, data, role.id)"
                        v-model="data[field]" @blur="validateFields(data, role.id)" />
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                        placeholder="Search by meaning" />
                </template>
            </Column>
        </template>
        <Column v-if="props.project.status_required" field="status" filterField="status" sortable
            :showFilterMenu="false">
            <template #body="{ data }">
                <StatusTag :value="data.status" />
            </template>
            <template #editor="{ data, field }">
                <StatusSelect v-model="data[field]" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <StatusMultiSelect v-model="filterModel.value" @change="filterCallback()" class="filter-width-enum" />
            </template>
        </Column>
        <Column v-if="props.project.equivalence_required" field="equivalence" filterField="equivalence" sortable
            :showFilterMenu="false">
            <template #body="{ data }">
                <EquivalenceTag :value="data.equivalence" />
            </template>
            <template #editor="{ data, field }">
                <EquivalenceSelect v-model="data[field]" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <EquivalenceMultiSelect v-model="filterModel.value" @change="filterCallback()"
                    class="filter-width-enum" />
            </template>
        </Column>
        <Column field="comment" filterField="comment" sortable class="grid-column-right">
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                    placeholder="Search by comment" />
            </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'created')" field="created" filterField="created"
            dataType="date" sortable>
            <template #body="{ data }">
                <DateFormat :value="data.created" />
            </template>
            <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy"
                    class="filter-width-date" />
            </template>
        </Column>
        <Column v-if="selectedColumns.some(col => col.field === 'modified')" field="modified" filterField="modified"
            dataType="date" sortable>
            <template #body="{ data }">
                <DateFormat :value="data.modified" />
            </template>
            <template #filter="{ filterModel }">
                <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy"
                    class="filter-width-date" />
            </template>
        </Column>
        <Column :rowEditor="userHasPermission(MappingUpdatePermission, projectStore, authStore)"
            style="width: auto; margin:0; padding:0%" bodyStyle="text-align:center">
        </Column>
        <Column :exportable="false" style="width: auto;  margin: 0; padding: 0%">
            <template #body="slotProps">
                <Button icon="pi pi-pen-to-square" text rounded @click="openEditMapping(slotProps.data)"
                    :disabled="!userHasPermission(MappingUpdatePermission, projectStore, authStore)"
                    v-tooltip.top="addButtonTooltip(MappingUpdatePermission)" />
                <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmDeleteMapping(slotProps.data)"
                    :disabled="!userHasPermission(MappingDeletePermission, projectStore, authStore)"
                    v-tooltip.top="addButtonTooltip(MappingDeletePermission)" />
            </template>
        </Column>
    </DataTable>
    <!-- Different dialogs which can pop up depending if the user triggered an action. -->
    <DeleteMappingDialog v-model:visible="deleteMappingDialog" :mappings="mappingsToDelete"
        :onDelete="onDeleteMapping" />
    <CreateMappingDialog v-model:visible="showCreateMappingDialog" :onSubmit="onCreateSubmit" />
    <EditMappingDialog v-model:visible="showEditMappingDialog" :mapping="editedMapping" :onSubmit="onEditSubmit" />

    <!-- This message is shown if there are no mappings to show. -->
    <Message v-if="props.mappings.length === 0" severity="warn" :closable="false">No data to show yet</Message>

    <PermissionRoleDialog v-model:visible="permissionRoleDialog" :role="projectStore.projectRole" />
</template>


<script setup lang='ts'>
import { useProjectStore, type ProjectDetails, type ProjectRole } from '@/stores/project';
import type { Mapping, UpdateMapping } from '@/stores/mappings';
import { onMounted, ref, watch } from 'vue';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import StatusTag from '../tags/StatusTag.vue';
import EquivalenceTag from '../tags/EquivalenceTag.vue';
import DateFormat from '../DateFormat.vue';
import ConceptAutoComplete from '@/components/autocomplete/ConceptAutoComplete.vue';
import { on_item_select_autocomplete, validateFields } from '@/utils/autocomplete';
import CreateMappingDialog from './CreateMappingDialog.vue';
import EditMappingDialog from './EditMappingDialog.vue';
import { useUpdateMappingQuery } from '@/composables/queries/mapping-query';
import EquivalenceMultiSelect from '@/components/multiselects/EquivalenceMultiSelect.vue';
import StatusMultiSelect from '@/components/multiselects/StatusMultiSelect.vue';
import DatePicker from 'primevue/datepicker';
import Popover from 'primevue/popover';
import { userHasPermission, MappingCreatePermission, MappingDeletePermission, MappingUpdatePermission, getButtonTooltip } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth';
import PermissionRoleDialog from '@/views/loggedIn/Project/PermissionRoleDialog.vue';
import { useRouter } from 'vue-router';

const permissionRoleDialog = ref(false);

const addButtonTooltip = (permission: ProjectRole[]) => {
    return getButtonTooltip(permission, projectStore, authStore);
};

// popup
const popUp = ref();
const onPopUpToggle = (event) => {
    popUp.value.toggle(event);
}


const projectStore = useProjectStore();
const authStore = useAuthStore();


const props = defineProps({
    mappings: {
        type: Array as () => Mapping[],
        required: true
    },
    project: {
        type: Object as () => ProjectDetails,
        required: true
    },
    loading: Boolean
});

// general elements needed

const toast = useToast();
const router = useRouter();

// pass datatable content to parent component

const emit = defineEmits(['set-datatable-ref']);
const dt = ref(null);

onMounted(() => {
    emit('set-datatable-ref', dt.value);
});


// Size options
const size = ref({ label: 'Normal', value: 'null' as 'small' | 'large' | undefined });
const sizeOptions = ref([
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'null' },
    { label: 'Large', value: 'large' }
]);

// Code for filtering the data in the DataTable

const filters = ref();

const initFilters = () => {
    const baseFilters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // comment: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        comment: { value: null, matchMode: FilterMatchMode.CONTAINS },
        created: { value: null, matchMode: FilterMatchMode.DATE_IS },
        modified: { value: null, matchMode: FilterMatchMode.DATE_IS },
        equivalence: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.IN },
    };

    // Add code and meaning filters dynamically based on code_system_roles
    props.project.code_system_roles.forEach(role => {
        baseFilters[`code_${role.id}`] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        baseFilters[`meaning_${role.id}`] = { value: null, matchMode: FilterMatchMode.CONTAINS };
    });

    filters.value = baseFilters;
};

const globalFilterFields: string[] = [
    'status',
    'equivalence.name',
    'comment',
    'created',
    'modified',
    ...props.project.code_system_roles.flatMap(role => [`code_${role.id}`, `meaning_${role.id}`])
];

// onMounted(() => {
initFilters();
// });

const clearFilter = () => {
    initFilters();
};


// show/hide create/edit dialog
const showCreateMappingDialog = ref(false);
const showEditMappingDialog = ref(false);

// creation dialog
const onCreateSubmit = (mapping: any) => {
    const transformedMapping = flattenMappings([mapping], props.project.code_system_roles)
    transformedMappings.value.push(transformedMapping[0]);
}

// editing dialog
const editedMapping = ref({
    equivalence: null,
    status: null,
});
const openEditMapping = (mapping: any) => {
    editedMapping.value = { ...mapping };
    showEditMappingDialog.value = true;
};
const onEditSubmit = (mapping: any) => {
    const index = transformedMappings.value.findIndex((m) => m.id === mapping.id);
    updateMapping(mapping, index);
};

// row editing
const editingRows = ref([]);
const onRowEditSave = (event: any) => {
    let { newData, index } = event;
    updateMapping(newData, index);
}

// used for row editing and for edit-dialog
function updateMapping(flattened_mapping: any, index: number) {
    const updated_mapping: UpdateMapping = {
        id: flattened_mapping.id,
        equivalence: flattened_mapping.equivalence,
        status: flattened_mapping.status,
        comment: flattened_mapping.comment,
        elements: [],
    };

    for (const role of props.project.code_system_roles) {
        if (flattened_mapping[`id_${role.id}`] != null) {
            updated_mapping.elements!.push({
                codeSystemRole: role.id,
                concept: flattened_mapping[`id_${role.id}`],
            });
        }
    }

    const { error, isFetching, isReady, state, execute } = useUpdateMappingQuery(props.project.id, updated_mapping);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Mapping updated successfully', life: 10000 });
                transformedMappings.value[index] = flattened_mapping;
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Mapping due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
}

// optional created and modified columns

const toggleColumns = ref([
    { field: 'created', header: 'Created' },
    { field: 'modified', header: 'Modified' },
]);

const selectedColumns = ref([]);

const onToggle = (val) => {
    selectedColumns.value = toggleColumns.value.filter(col => val.includes(col));
};

// selection and deletion of mappings

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

// export mappings to CSV

const exportCSV = () => {
    dt.value.exportCSV();
};


const editProjectView = (projectId: number) => {
    router.push(`/dashboard/projects/${projectId}/edit`);
}

// The mappings which are received from the backend need to be flattened in order to be displayed in the DataTable

const transformedMappings = ref(flattenMappings(props.mappings, props.project.code_system_roles));

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

// defineExpose({ exportCSV });
</script>

<style scoped>
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

.flex-col {
    flex-direction: column;
    align-items: flex-start;
}

/* .flex-column {
    display: flex;
    flex-direction: column;
} */

.align-left {
    align-items: flex-start;
}

.filter-width-date {
    min-width: 110px;
}

/* .filter-width-enum {
    min-width: 40px;
} */

.filter-width-code {
    width: 130px;
}
</style>