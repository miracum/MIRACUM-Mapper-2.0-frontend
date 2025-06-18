<template>
    <Accordion>
        <AccordionPanel v-for="(item, index) in tranformedChanges" :key="index" :value="index">
            <AccordionHeader style="background-color: #f5f5f5;">
                <div>
                    <span class="me-3">{{ item.old_concept.code }}</span>
                    <span><ConceptStatusTag :value="item.old_concept.status" /></span>
                </div>
            </AccordionHeader>
            <AccordionContent>
                <div class="mb-3 mt-2">
                    <p v-if="!item.new_concept || item.old_concept.meaning === item.new_concept.meaning"><strong>Meaning:</strong> {{ item.old_concept.meaning }}</p>
                    <p v-else>
                        <strong>Old meaning:</strong> {{ item.old_concept.meaning }}
                        <br />
                        <strong>New meaning:</strong> {{ item.new_concept.meaning }}
                    </p>
                    <div v-if="!item.new_concept" class="mt-3">
                        <p v-if="item.old_concept.description"><strong>Description:</strong> {{ item.old_concept.description }}</p>
                    </div>
                    <div v-else class="mt-3">
                        <div v-if="item.old_concept.description && item.new_concept.description">
                            <p v-if="item.old_concept.description === item.new_concept.description">
                                <strong>Description:</strong> {{ item.old_concept.description }}
                            </p>
                            <p v-else>
                                <strong>Old description:</strong> {{ item.old_concept.description }}
                                <br />
                                <strong>New description:</strong> {{ item.new_concept.description }}
                            </p>
                        </div>
                        <p v-else-if="item.old_concept.description">
                            <strong>Old description:</strong> {{ item.old_concept.description }}
                            <br />
                            <strong>New description:</strong> <em>was deleted</em>
                        </p>
                        <p v-else-if="item.new_concept.description">
                            <strong>Old description:</strong> <em>was added</em>
                            <br />
                            <strong>New description:</strong> {{ item.new_concept.description }}
                        </p>
                    </div>
                </div>
                <div class="mb-3">
                    <strong class="me-3">Choose review option for all mappings:</strong>
                    <Select v-model="item.selected" :options="conceptOptions" optionLabel="label" optionValue="value" placeholder="Choose an option for the mappings" @change="(event) => {
                        if (!(event.value == 'new')) {
                            item.selected_concept = undefined;
                        }
                    }" />
                </div>
                <div v-if="item.replace_by.length !== 0" class="mb-3">
                    <strong>Suggested new concepts:</strong>
                    <ul class="circle-list">
                        <li v-for="replace in item.replace_by" :key="replace.concept.id">
                            <span class="flex align-items-center gap-3">
                                <strong>{{ replace.concept.code }}</strong>
                                <StatusTag :value="replace.concept.status" />
                                <Tag v-if="replace.equivalence" :value="replace.equivalence" />
                                <span v-if="replace.comment"> Comment: {{ replace.comment }}</span>
                            </span>
                        </li>
                    </ul>
                </div>
                <div v-if="item.selected == 'new'" class="mb-3">
                    <strong class="me-3">New concept:</strong>
                    <Button v-if="item.selected_concept" icon="pi pi-pencil" :label="item.selected_concept.code" severity="success" @click="newConceptDialogVisible = true; conceptIndex = index; mappingIndex = -1" />
                    <Button v-else label="Select concept" @click="newConceptDialogVisible = true; conceptIndex = index; mappingIndex = -1" />
                </div>

                <DataTable :value="item.mappings" stripedRows dataKey="id">
                    <!-- This defines the header rows of the DataTable. The code systems should be a column which spans over the code and meaning columns so is has to be defined how many columns they span. This makes the use of ColumnGroups necessary -->
                    <ColumnGroup type="header">
                        <Row>
                            <Column v-for="role in project.code_system_roles" :colspan="3" :key="role.id" style="border-right: 1px solid #e3e8f0">
                                <template #header>
                                    <CodeSystemRole :role="role" />
                                </template>
                            </Column>
                            <Column header="Status" v-if="project.status_required" :rowspan="2" field="status"></Column>
                            <Column header="Equivalence" v-if="project.equivalence_required" :rowspan="2" field="equivalence"></Column>
                            <Column header="Comment" :rowspan="2" field="comment" style="border-right: 1px solid #e3e8f0"></Column>
                            <Column header="Review option" :rowspan="2"></Column>
                            <Column header="New concept" :rowspan="2"></Column>
                        </Row>
                        <Row>
                            <template v-for="role in project.code_system_roles" :key="role.id">
                                <Column header="Status" :field="`status_${role.id}`"></Column>
                                <Column header="Code" :field="`code_${role.id}`"></Column>
                                <Column header="Meaning" :field="`meaning_${role.id}`" style="border-right: 1px solid #e3e8f0"></Column>
                            </template>
                        </Row>
                    </ColumnGroup>
                    <!-- After defining the header rows, the content of the elements in the DataTable are defined -->
                    <template v-for="role in project.code_system_roles" :key="role.id">
                        <Column v-if="project.status_required" :field="`status_${role.id}`">
                            <template #body="{ data }">
                                <ConceptStatusTag :value="data[`status_${role.id}`]" />
                            </template>
                        </Column>
                        <Column :field="`code_${role.id}`"></Column>
                        <Column :field="`meaning_${role.id}`" style="border-right: 1px solid #e3e8f0"></Column>
                    </template>
                    <Column v-if="project.status_required" field="status">
                        <template #body="{ data }">
                            <StatusTag :value="data.status" />
                        </template>
                    </Column>
                    <Column v-if="project.equivalence_required" field="equivalence">
                        <template #body="{ data }">
                            <EquivalenceTag :value="data.equivalence" />
                        </template>
                    </Column>
                    <Column field="comment" filterField="comment" style="border-right: 1px solid #e3e8f0">
                        <template #body="{ data }">
                            {{ data.comment }}
                        </template>
                    </Column>
                    <Column style="padding:0%" bodyStyle="text-align:center">
                        <template #body="{ data }">
                            <Select v-model="data.selected" :options="mappingOptions" optionLabel="label" optionValue="value" placeholder="Choose a review option" @change="(event) => {
                                if (!(event.value == 'new')) {
                                    data.selected_concept = undefined;
                                }
                            }" />
                        </template>
                    </Column>
                    <Column style="padding:0%" bodyStyle="text-align:center">
                        <template #body="{ data, index: rowIndex }">
                            <div v-if="data.selected == 'new'">
                                <Button v-if="data.selected_concept" icon="pi pi-pencil" :label="data.selected_concept.code" severity="success" @click="newConceptDialogVisible = true; conceptIndex = index; mappingIndex = rowIndex" />
                                <Button v-else label="Select concept" @click="newConceptDialogVisible = true; conceptIndex = index; mappingIndex = rowIndex" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
    <NewConceptDialog :roleId="props.roleId" :conceptIndex="conceptIndex" :mapping-index="mappingIndex" :visible="newConceptDialogVisible" @concept-select="setConcept" @update:visible="newConceptDialogVisible = $event" />
</template>

<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Select from 'primevue/select';
import NewConceptDialog from './NewConceptDialog.vue';

import { computed, reactive, ref, type PropType, type Reactive, type Ref } from 'vue';
import { useProjectStore, type CodeSystemRole } from '@/stores/project';
import { type Concept, type ReplaceBy } from '@/stores/codesystem';
import { type MigrateMapping, type MigrationChanges } from '@/composables/queries/project-migration-query';
import { type Mapping } from '@/stores/mappings';
import { getConceptOptions, getMappingOptions } from '@/utils/migrationOptions';
import StatusTag from '@/components/tags/StatusTag.vue';

type Changes = {
    old_concept: Concept;
    new_concept?: Concept;
    mappings: Mapping[];
    replace_by: ReplaceBy[];
}[];

type TransformedChanges = {
    old_concept: Concept;
    new_concept?: Concept;
    selected: Ref;
    selected_concept: Concept | undefined;
    mappings: {
        comment: string;
        status: string;
        equivalence: string;
        id: number;
        selected: Ref;
        selected_concept: Concept | undefined;
        [key: string]: any; // This allows for dynamic properties based on roles
    }[];
    replace_by: {
        concept: Concept;
        equivalence?: string;
        comment?: string;
    }[];
}[];

const props = defineProps({
    migrationChanges: {
        type: Object as PropType<MigrationChanges>,
        required: true,
    },
    changesType: {
        type: String as PropType<'deleted' | 'deprecated' | 'discouraged' | 'meaning' | 'description'>,
        required: true,
    },
    roleId: {
        type: Number,
        required: true,
    },
});

const projectStore = useProjectStore();
const project = projectStore.currentProjectDetails!;

const conceptOptions = getConceptOptions(props.changesType);
const mappingOptions = getMappingOptions(props.changesType);

const changes = computed((): Changes => {
    switch (props.changesType) {
        case 'deleted':
            return props.migrationChanges.deleted;
        case 'deprecated':
            return props.migrationChanges.deprecated;
        case 'discouraged':
            return props.migrationChanges.discouraged;
        case 'meaning':
            return props.migrationChanges.change_display;
        case 'description':
            return props.migrationChanges.change_description;
        default:
            return [];
    }
});

const tranformedChanges = transformChanges(changes.value, project.code_system_roles);

function transformChanges(changes: Changes, roles: CodeSystemRole[]): Reactive<TransformedChanges> {
    return reactive(changes.map(change => {
        return {
            old_concept: change.old_concept,
            new_concept: change.new_concept,
            selected: 'none',
            selected_concept: undefined as Concept | undefined,
            mappings: change.mappings.map(mapping => {
                const flattened: any = {
                    comment: mapping.comment,
                    status: mapping.status,
                    equivalence: mapping.equivalence,
                    id: mapping.id,
                    selected: 'default_option',
                    selected_concept: undefined as Concept | undefined,
                };
                roles.forEach(role => {
                    const element: any = mapping.elements.find(el => el.codeSystemRole === role.id);
                    if (element) {
                        flattened[`code_${role.id}`] = element.concept.code;
                        flattened[`meaning_${role.id}`] = element.concept.meaning;
                        flattened[`id_${role.id}`] = element.concept.id;
                        flattened[`status_${role.id}`] = element.concept.status;
                    } else {
                        flattened[`code_${role.id}`] = '';
                        flattened[`meaning_${role.id}`] = '';
                        flattened[`id_${role.id}`] = null;
                        flattened[`status_${role.id}`] = null;
                    }
                })
                return flattened;
            }),
            replace_by: change.replace_by.map(replace => {
                return {
                    concept: replace.map_to,
                    equivalence: replace.equivalence,
                    comment: replace.comment,
                };
            }),
        };
    }));
}

const newConceptDialogVisible = ref(false);
const conceptIndex = ref(-1);
const mappingIndex = ref(-1);

const setConcept = (conceptIndex: number, mappingIndex: number, concept: Concept) => {
    if (mappingIndex == -1) {
        tranformedChanges[conceptIndex].selected_concept = concept;
    } else {
        tranformedChanges[conceptIndex].mappings[mappingIndex].selected_concept = concept;
    }
};

const getMigrations = () => {
    const result: MigrateMapping[] = [];
    for (let migration of tranformedChanges) {
        for (let mapping of migration.mappings) {
            if (mapping.selected == 'none') {
                continue;
            } else if (mapping.selected == 'default_option') {
                if (migration.selected == 'none') {
                    continue;
                } else if (migration.selected == 'new') {
                    result.push({
                        migration_type: migration.selected,
                        mapping_id: mapping.id,
                        new_concept_id: migration.selected_concept?.id,
                    });
                } else {
                    result.push({
                        migration_type: migration.selected,
                        mapping_id: mapping.id,
                    });
                }
            } else if (mapping.selected == 'new') {
                result.push({
                    migration_type: mapping.selected,
                    mapping_id: mapping.id,
                    new_concept_id: mapping.selected_concept?.id,
                });
            } else {
                result.push({
                    migration_type: mapping.selected,
                    mapping_id: mapping.id,
                });
            }
        }
    }
    console.log('getMigrations', result, props.changesType);
    return result;
};

defineExpose({
    getMigrations,
});

</script>

<style scoped>
.circle-list {
    list-style-type: disc;
    padding-left: 3rem;
}
.circle-list li {
    margin-top: 0.5rem;
}
</style>