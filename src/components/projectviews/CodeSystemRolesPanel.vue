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
                            :invalid="submitted && !slotProps.data.codeSystem" />
                        <small class="p-error" v-if="submitted && !slotProps.data.codeSystem">CodeSystem is
                            required.</small>
                    </div>
                    <div v-else>
                        <div style="font-weight: bold;">{{ slotProps.data.codeSystem.codeSystemName }}</div>
                        <div>{{ slotProps.data.codeSystem.name }}</div>
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
                        <InputText v-model=slotProps.data.name placeholder="Name"
                            :invalid="submitted && !slotProps.data.name" />
                        <small class="p-error" v-if="submitted && !slotProps.data.name">Name is required.</small>
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
import { type PropType, ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import CodeSystemSelect from '@/components/selects/CodeSystemSelect.vue';
import { useGetCodeSystemsQuery } from '@/composables/queries/project-query';
import { type CodeSystem } from '@/stores/project';


// for possible error messages
const toast = useToast();


const props = defineProps({
    project: {
        type: Object as PropType<{ name: string, version: string, description: string, equivalence_required: boolean, status_required: boolean }>,
        required: true
    },
    codeSystemRoles: {
        type: Array as PropType<Array<{ codeSystem: number; role: string, name: string }>>,
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


const codeSystems = ref<Array<{ name: string; versions: { id: number; name: string; codeSystemName: string; }[] }>>([]);
const getCodeSystems = () => {
    const { state, isReady, isFetching, error, execute } = useGetCodeSystemsQuery();
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                codeSystems.value = mergeCodeSystems(state.value);
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not fetch codesystems due to a server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    });
    execute();
};
const mergeCodeSystems = (systems: Array<CodeSystem>) => {
    const merged = systems.reduce((acc: { [key: string]: { name: string, versions: Array<{ id: number, name: string, codeSystemName: string }> } }, system) => {
        const { name, id, version } = system;
        if (!acc[name]) {
            acc[name] = { name, versions: [] };
        }
        acc[name].versions.push({ id, name: version, codeSystemName: name });
        return acc;
    }, {});

    return Object.values(merged);
}
getCodeSystems();



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