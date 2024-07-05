<template>
    <div v-if="props.mappings.length === 0" class="text-center">
        <h3>No data to show yet.</h3>
    </div>
    <DataTable :value="transformedMappings" tableStyle="min-width: 50rem" responsiveLayout="scroll"
        v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" v-else :pt="{
            table: { style: 'min-width: 50rem' },
            column: {
                bodycell: ({ state }) => ({
                    style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                })
            }
        }">
        <ColumnGroup type="header">
            <Row>
                <Column v-for="role in props.project.code_system_roles"
                    :header="`${role.system.name} ${role.name} (${role.type})`" :colspan="2"></Column>
                <Column header="Status" v-if="props.project.status_required" :rowspan="2"></Column>
                <Column header="Equivalence" v-if="props.project.equivalence_required" :rowspan="2"></Column>
                <Column header="Comment" :rowspan="2"></Column>
            </Row>
            <Row>
                <template v-for="role in props.project.code_system_roles">
                    <Column header="Code"></Column>
                    <Column header="Meaning"></Column>
                </template>
            </Row>
        </ColumnGroup>
        <template v-for="(col, index) in columns" :key="index">
            <Column :field="col.field">
                <!-- <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template> -->
            </Column>
        </template>
        <!-- <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column> -->
    </DataTable>
</template>

<script setup lang='ts'>
import { useProjectStore } from '@/stores/project';
import { useMappingStore } from '@/stores/mappings';
import type { ProjectDetails, Mapping, FullElement, CodeSystemRole } from '@/client/types.gen';
import { ref, computed } from 'vue';
import Column from 'primevue/column';

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

const transformedMappings = flattenMappings(props.mappings, props.project.code_system_roles);
const columns = generateColumns(props.project.code_system_roles);

function flattenMappings(mappings: Mapping[], roles: CodeSystemRole[]): any[] {
    const transformedMappings = [];
    mappings.forEach(mapping => {
        const flattened = {
            status: mapping.status,
            equivalence: mapping.equivalence,
            comment: mapping.comment
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

    columns.push({ field: 'status', header: 'Status' });
    columns.push({ field: 'equivalence', header: 'Equivalence' });
    columns.push({ field: 'comment', header: 'Comment' });

    return columns;
}

const onRowEditSave = (event) => {
    let { newData, index} = event;
    console.log("AAAAAAAAAAAAAAAA");
    console.log(newData);
    console.log(index);
}


// const elements = ref([] as FullElement[][]);
// for (let i = 0; i < props.mappings.length; i++) {
//     elements.value.push(props.mappings[i].elements);
// }

const projectStore = useProjectStore();
const mappingStore = useMappingStore();

</script>
