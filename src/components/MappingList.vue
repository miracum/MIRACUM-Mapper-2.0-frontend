<template>

    <!-- v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" :pt="{
    table: { style: 'min-width: 50rem' },
    column: {
    bodycell: ({ state }) => ({
    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
    })
    }
    }" -->
    <DataTable v-model:filters="filters" :value="transformedMappings" ref="dt" tableStyle="min-width: 50rem"
        filterDisplay="row" :globalFilterFields="['status', 'equivalence', 'comment']" responsiveLayout=" scroll"
        editMode="row" dataKey="id" @row-edit-save="onRowEditSave" v-model:editingRows="editingRows" :pt="{
            table: { style: 'min-width: 10' },
            column: {
                bodycell: ({ state }) => ({
                    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                })
            }
        }" :paginator="true" :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} mappings">
        <template #header>
            <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
            <div class="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>
        </template>
        <ColumnGroup type="header">
            <Row>
                <Column v-for="role in props.project.code_system_roles" :colspan="2">
                    <template #header>
                        <div style="display: flex; gap: 5px;">
                            <Tag :value="role.type" :severity="getRole(role.type)" />
                            <span class="name">{{ role.system.name }}</span>
                            <span class="code p-text-secondary">{{ role.name }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="Status" v-if="props.project.status_required" :rowspan="2" field="status" sortable>
                </Column>
                <Column header="Equivalence" v-if="props.project.equivalence_required" :rowspan="2" sortable
                    field="equivalence">
                </Column>
                <Column header="Comment" :rowspan="2" sortable field="comment" filterField="comment">
                    <template #filter="{ filterModel, filterCallback }">
                        <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                            class="p-column-filter" placeholder="Search by comment" />
                    </template>
                </Column>
            </Row>
            <Row>
                <template v-for="role in props.project.code_system_roles">
                    <Column header="Code" :field="`code_${role.id}`" sortable></Column>
                    <Column header="Meaning" :field="`meaning_${role.id}`" sortable></Column>
                </template>
            </Row>
        </ColumnGroup>
        <template v-for="role in props.project.code_system_roles">
            <Column :field="`code_${role.id}`" sortable>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column :field="`meaning_${role.id}`" sortable>
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
        <Column field="comment" sortable>
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" />
            </template>
        </Column>
        <Column :rowEditor="true" style="width: 3%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        <!-- <template v-if="props.mappings.length > 0" v-for="(col, index) in columns" :key="index">
                <Column :field="col.field" sortable>
                    <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
                </Column>
            </template> -->
        <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
            </Column> -->
    </DataTable>
    <Message v-if="props.mappings.length === 0" severity="warn" :closable="false">No data to show yet</Message>
</template>

<script setup lang='ts'>
import { useProjectStore } from '@/stores/project';
import { useMappingStore } from '@/stores/mappings';
import type { ProjectDetails, Mapping, FullElement, CodeSystemRole } from '@/client/types.gen';
import { ref, computed } from 'vue';
import Column from 'primevue/column';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

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

const dt = ref();

const exportCSV = () => {
    dt.value.exportCSV();
};

const emptyRow = ref(new Array(1));

const transformedMappings = ref(flattenMappings(props.mappings, props.project.code_system_roles));
const columns = generateColumns(props.project.code_system_roles);

function flattenMappings(mappings: Mapping[], roles: CodeSystemRole[]): any[] {
    const transformedMappings = [];
    mappings.forEach(mapping => {
        const flattened = {
            comment: mapping.comment,
            status: mapping.status,
            equivalence: mapping.equivalence,
            id: mapping.id
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

function getOptions(obj: any) {
    return Object.keys(obj).map(key => ({ label: obj[key], value: key }));
}

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

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    comment: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // 'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // representative: { value: null, matchMode: FilterMatchMode.IN },
    // status: { value: null, matchMode: FilterMatchMode.EQUALS },
    // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const editingRows = ref([]);

const onRowEditSave = (event: any) => {
    let { newData, index } = event;
    transformedMappings.value[index] = newData;
}

const projectStore = useProjectStore();
const mappingStore = useMappingStore();

</script>