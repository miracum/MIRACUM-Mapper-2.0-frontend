<template>
    <!-- <Panel>
        <template #header>
            <div class="header">
                <h1 class="title">Add Project</h1>
            </div>
        </template>
<h2 class="subtitle">Create a new Mapping Project</h2>
</Panel> -->

    <div class="flex-row">
        <Panel header="Add Project">
            <div class="panel-container-information">
                Create a new Mapping Project.
            </div>
        </Panel>
        <Panel header="General Information">
            <div class="panel-container-general">
                <div class="flex flex-row gap-4 mt-3">
                    <FloatLabel class="flex flex-col flex-2">
                        <InputText id="name" v-model="project.name" />
                        <label for="name">Name</label>
                    </FloatLabel>
                    <FloatLabel class="flex flex-col flex-1">
                        <InputText id="version" v-model="project.version" />
                        <label for="version">Version</label>
                    </FloatLabel>
                </div>
                <FloatLabel class="w-full mt-5">
                    <Textarea id="description" v-model="project.description" rows="5" class="w-full" />
                    <label for="description">Description</label>
                </FloatLabel>
            </div>
        </Panel>
    </div>
    <div class="flex-row">
        <Panel>
            <template #header>
                <div class="flex justify-content-between">
                    <div class="font-bold">Permissions</div>
                </div>
            </template>
            <template #icons>
                <Button label="Add Permission" icon="pi pi-plus" severity="success" class="mr-2"
                    @click="addPermission" />
            </template>
            <div class="panel-container-permissions">
                <DataTable :value="userPermissions" tableStyle="min-width: 30rem"
                    @rowReorder="onUserPermissionsRowReorder" scrollable scroll-height="500px">
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
            </div>
        </Panel>
        <Panel>
            <template #header>
                <div class="flex justify-content-between">
                    <div class="font-bold">Code System Roles</div>
                </div>
            </template>
            <template #icons>
                <Button label="Add Role" icon="pi pi-plus" severity="success" class="mr-2" @click="addRole" />
            </template>
            <div class="panel-container-roles">
                <DataTable :value="codeSystemRoles" tableStyle="min-width: 30rem" @rowReorder="onCodeSystemRowReorder"
                    scrollable scroll-height="500px">
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
            </div>
        </Panel>
    </div>

</template>

<script setup lang="ts">
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
.full-width {
    width: 100%;
    margin-top: 10px;
}

.flex-row {
    display: flex;
    width: 100%;
}

.flex-item {
    display: flex;
    flex-direction: column;
}

.flex-item-name {
    flex: 2;
    /* Takes 2/3rds of the space */
}

.flex-item-version {
    flex: 1;
    /* Takes 1/3rd of the space */
}


.panel-container-general {
    width: 800px;
    /* height: 190px; */
    /* margin: 0 auto; */
    /* Center the container horizontally */
}

.panel-container-information {
    width: 600px;
    height: 205px;
    /* margin: 0 auto; */
    /* Center the container horizontally */
}

.panel-container-permissions {
    width: 600px;
    height: 500px;
    /* margin: 0 auto; */
    /* Center the container horizontally */
}

.panel-container-roles {
    width: 800px;
    height: 500px;
    /* margin: 0 auto; */
    /* Center the container horizontally */
}

.flex-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

/* .flex-row Panel {
    width: calc(50% - 10px);
} */
</style>