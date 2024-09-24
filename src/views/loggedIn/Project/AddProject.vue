<template>
    <div class="grid-container">
        <Card class="grid-item">
            <template #title>
                Add Project
            </template>
            <template #content>
                <div>Create a new Mapping Project.</div>
            </template>
        </Card>
        <Card class="grid-item">
            <template #title>
                General Information
            </template>
            <template #content>
                <div class="flex gap-4">
                    <FloatLabel style="flex:2"> <!--class="flex flex-col flex-2"-->
                        <InputText id="name" v-model="project.name" class="w-full" />
                        <label for="name">Name</label>
                    </FloatLabel>
                    <FloatLabel style="flex:1"> <!--class="flex flex-col flex-1"-->
                        <InputText id="version" v-model="project.version" class="w-full" />
                        <label for="version">Version</label>
                    </FloatLabel>
                </div>
                <FloatLabel class="mt-5">
                    <Textarea id="description" v-model="project.description" rows="5" class="w-full" />
                    <label for="description">Description</label>
                </FloatLabel>
            </template>
        </Card>
        <Card class="grid-item">
            <template #title>
                <div>Permissions</div>
            </template>
            <template #content>
                <Button label="Add Permission" icon="pi pi-plus" severity="success" class="mr-2"
                    @click="addPermission" />
                <DataTable :value="userPermissions" tableStyle="min-width: 30rem"
                    @rowReorder="onUserPermissionsRowReorder" scrollable scroll-height="200px">
                    <Column rowReorder headerStyle="width: 3rem" />
                    <Column header="User">
                        <template #body="slotProps">
                            <div class="inline-flex align-items-center gap-1 px-2 py-2">
                                <Avatar icon="pi pi-user" class="mr-2" size="large"
                                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                                <span class="inline-flex flex-col items-start">
                                    <span class="font-bold">{{ slotProps.data.user.name }}</span>
                                    <span class="text-sm">{{ slotProps.data.user.email }}</span>
                                </span>
                            </div>
                        </template>
                    </Column>
                    <Column header="Permission">
                        <template #body="slotProps">
                            <UserPermissionSelect v-model="slotProps.data.role" />
                        </template>
                    </Column>
                    <Column style="width: auto; margin: 0; padding: 0%" v-if="userPermissions.length > 1">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" text rounded severity="danger"
                                @click="onUserPermissionDelete(slotProps.index)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <Card class="grid-item">
            <template #title>
                Code System Roles
            </template>
            <template #content>
                <Button label="Add Role" icon="pi pi-plus" severity="success" class="mr-2" @click="addRole" />
                <DataTable :value="codeSystemRoles" tableStyle="min-width: 30rem" @rowReorder="onCodeSystemRowReorder"
                    scrollable scroll-height="200px">
                    <Column rowReorder headerStyle="width: 3rem" />
                    <Column header="CodeSystem">
                        <template #body="slotProps">
                            <!-- <RoleSelect v-model="slotProps.data.role" /> -->
                            <!-- <CodeSystemNameAutoComplete v-model="slotProps.data.codeSystem" /> -->
                            <CodeSystemSelect v-model="slotProps.data.codeSystem" :codeSystems="codeSystems" />
                        </template>
                    </Column>

                    <Column header="Role">
                        <template #body="slotProps">
                            <RoleSelect v-model="slotProps.data.role" />
                        </template>
                    </Column>
                    <Column header="Name">
                        <template #body="slotProps">
                            <InputText v-model=slotProps.data.name placeholder="Name" />
                        </template>
                    </Column>
                    <Column style="width: auto; margin: 0; padding: 0%" v-if="codeSystemRoles.length > 1">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" text rounded severity="danger"
                                @click="onCodeSystemDelete(slotProps.index)" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>

</template>

<script setup lang="ts">
import Card from 'primevue/card';
import CodeSystemSelect from '@/components/selects/CodeSystemSelect.vue';
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useGetCodeSystemsQuery } from '@/composables/queries/project-query';
import { type CodeSystem } from '@/stores/project';

// for possible error messages
const toast = useToast();

/////////// user permissions
const userPermissions = ref([
    // {
    //     user: {
    //         name: 'John Doe',
    //         email: 'john.doe@fau.de',
    //         id: 1
    //     },
    //     role: 'reviewer'
    // },
    // {
    //     user: {
    //         name: 'Jane Doe',
    //         email: 'jane.doe@fau.de',
    //         id: 2
    //     },
    //     role: 'project_owner'
    // }
    {
        user: {
            name: 'John Doe',
            email: 'john.doe@fau.de',
            id: 1
        },
        role: ''
    }
]);

const onUserPermissionsRowReorder = (event) => {
    userPermissions.value = event.value;
};

const onUserPermissionDelete = (index) => {
    userPermissions.value.splice(index, 1);
};

const addPermission = () => {
    userPermissions.value.push({
        user: {
            name: 'John Doe',
            email: 'john.doe@fau.de',
            id: 1
        },
        role: ''
    });
};

/////////// code system roles
const codeSystemRoles = ref([
    // {
    //     codeSystem: {
    //         codeSystemName: 'SNOMED CT',
    //         name: '1.2.5',
    //         id: 1
    //     },
    //     role: 'source',
    //     name: 'SNOMED CT'
    // },
    // {
    //     codeSystem: {
    //         codeSystemName: 'Loinc',
    //         name: '1.2.5',
    //         id: 2
    //     },
    //     role: 'target',
    //     name: 'LOINC'
    // }
    {
        codeSystem: null,
        role: '',
        name: ''
    }

]);

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

const onCodeSystemRowReorder = (event) => {
    codeSystemRoles.value = event.value;
};

const onCodeSystemDelete = (index) => {
    codeSystemRoles.value.splice(index, 1);
};

const addRole = () => {
    codeSystemRoles.value.push({
        codeSystem: null,
        role: '',
        name: ''
    });
};

/////////// general information
const project = ref({
    name: '',
    version: '',
    description: ''
});
</script>

<style scoped>
/* Grid container for the 2x2 layout */
.grid-container {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    /* grid-gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    width: 100%;
    height: auto; */
}

/* Grid items */
.grid-item {
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
}

/* Responsive Design: Stack on smaller screens */
@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}
</style>