<template>
    <Panel class="grid-item" header="Code System Roles">
        <Button label="Add Role" icon="pi pi-plus" severity="success" class="mr-2 mt-3" @click="addRole"
            v-if="editCodeSystemRolesPossible" />
        <DataTable :value="codeSystemRoles" tableStyle="min-width: 30rem" @rowReorder="onCodeSystemRolesRowReorder"
            scrollable scroll-height="500px">
            <Column rowReorder headerStyle="width: 3rem" v-if="editCodeSystemRolesPossible" />
            <Column header="CodeSystem">
                <template #body="slotProps">
                    <div v-if="editCodeSystemRolesPossible">
                        <CodeSystemSelect v-model="slotProps.data.codeSystem" :codeSystems="codeSystems"
                            :invalid="submitted && !slotProps.data.codeSystem" 
                            @update:selectedCodeSystem="(cs) => handleSelectedCodeSystem(cs, slotProps.data)" />
                        <small class="p-error" v-if="submitted && !slotProps.data.codeSystem">CodeSystem is
                            required.</small>
                    </div>
                    <div v-else>
                        <!-- <div style="font-weight: bold;">{{ slotProps.data.codeSystem.codeSystemName }}</div> -->
                        <div>{{ slotProps.data.codeSystem.codeSystemName }}</div>
                    </div>
                </template>
            </Column>
            <Column header="Version">
                <template #body="slotProps">
                    <div v-if="editCodeSystemRolesPossible">
                        <CodeSystemVersionSelect v-model="slotProps.data.version" :codeSystem="slotProps.data.codeSystem"
                            :invalid="submitted && !slotProps.data.version" />
                        <small class="p-error" v-if="submitted && !slotProps.data.version">Version is
                            required.</small>
                    </div>
                    <div v-else>
                        <!-- <div style="font-weight: bold;">{{ slotProps.data.codeSystem.codeSystemName }}</div> -->
                        <div>{{ slotProps.data.codeSystem.versionName }}</div>
                    </div>
                </template>
            </Column>
            <Column header="Role">
                <template #body="slotProps">
                    <div style="flex:1">
                        <RoleSelect v-model="slotProps.data.role" :invalid="submitted && !slotProps.data.role" />
                        <small class="p-error" v-if="submitted && !slotProps.data.role">Role is required.</small>
                    </div>
                </template>
            </Column>
            <Column header="Name">
                <template #body="slotProps">
                    <div>
                        <InputText v-model=slotProps.data.name placeholder="Name" />
                        <!-- :invalid="submitted && !slotProps.data.name"-->
                        <!-- <small class="p-error" v-if="submitted && !slotProps.data.name">Name is required.</small> -->
                    </div>
                </template>
            </Column>
            <Column style="width: auto; margin: 0; padding: 0%"
                v-if="codeSystemRoles.length > 1 && editCodeSystemRolesPossible">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" text rounded severity="danger"
                        @click="onCodeSystemDelete(slotProps.index)" />
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<script setup lang="ts">
import { computed, type PropType, ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import CodeSystemSelect from '@/components/selects/CodeSystemSelect.vue';
import CodeSystemVersionSelect from '@/components/selects/CodeSystemVersionSelect.vue';
import { useGetCodeSystemsQuery } from '@/composables/queries/project-query';
import { type CodeSystem } from '@/stores/project';
import { type GetCodeSystem, type GetCodeSystemVersion, useCodeSystemStore } from '@/stores/codesystem';


// for possible error messages
const toast = useToast();

const codeSystemStore = useCodeSystemStore();


const props = defineProps({
    project: {
        type: Object as PropType<{ name: string, version: string, description: string, equivalence_required: boolean, status_required: boolean }>,
        required: true
    },
    codeSystemRoles: {
        type: Array as PropType<Array<{ codeSystem: number; version: number; role: string, name: string }>>,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    },
    editCodeSystemRolesPossible: {
        type: Boolean,
        required: false
    }
});

const editCodeSystemRolesPossible = props.editCodeSystemRolesPossible ?? true


const codeSystems = ref<Array<GetCodeSystem>>([]);
const { isFetching, error } = codeSystemStore.refreshState();
watch(isFetching, (newVal) => {
    if (!newVal) {
        if (!error.value) {
            codeSystems.value = codeSystemStore.codeSystems;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: `Could not fetch codesystems due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
        }
    }
});

let versions = ref<Array<GetCodeSystemVersion>>([]);

const handleSelectedCodeSystem = (codeSystem: GetCodeSystem, rowData: any) => {
    rowData.version = null;
    if (!codeSystem) {
        versions.value = [];
        return;
    }
    versions.value = codeSystemStore.getVersions(codeSystem.id).value;
};


const emit = defineEmits(['update:codeSystemRoles']);
const onCodeSystemRolesRowReorder = (event) => {
    emit('update:codeSystemRoles', event.value);
};

const onCodeSystemDelete = (index: number) => {
    props.codeSystemRoles.splice(index, 1);
};

const addRole = () => {
    props.codeSystemRoles.push({
        codeSystem: 0,
        role: '',
        name: ''
    });
};
</script>