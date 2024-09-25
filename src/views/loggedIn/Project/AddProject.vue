<template>
    <div class="grid-container">
        <Panel class="grid-item" header="Add project">
            <div>Create a new Mapping Project.</div>
            <div class="flex gap-4 mt-4">
                <div>
                    <FloatLabel style="flex:2">
                        <InputText id="name" v-model="project.name" class="w-full"
                            :invalid="submitted && !project.name" />
                        <label for="name">Name</label>
                    </FloatLabel>
                    <small class="p-error" v-if="submitted && !project.name">Name is required.</small>
                </div>
                <div>
                    <FloatLabel style="flex:1">
                        <InputText id="version" v-model="project.version" class="w-full"
                            :invalid="submitted && !project.version" />
                        <label for="version">Version</label>
                    </FloatLabel>
                    <small class="p-error" v-if="submitted && !project.version">Version is required.</small>
                </div>
            </div>
            <div>
                <FloatLabel class="mt-5">
                    <Textarea id="description" v-model="project.description" rows="5" class="w-full"
                        :invalid="submitted && !project.description" />
                    <label for="description">Description</label>
                </FloatLabel>
                <small class="p-error" v-if="submitted && !project.description">Description is required.</small>
            </div>
        </Panel>
        <Panel class="grid-item" header="Specification">
            <div>This cannot be changed later.</div>
            <div class="flex flex-col">
                <div class="flex mt-3">
                    <Checkbox v-model="project.equivalence_required" :binary="true" />
                    <label class="ml-2">Enable to select the equivalence of a mapping</label>
                </div>
                <div class="flex mt-3">
                    <Checkbox v-model="project.status_required" :binary="true" />
                    <label class="ml-2">Enable to select the status of a mapping</label>
                </div>
            </div>
        </Panel>
        <Panel class="grid-item" header="Permissions">
            <Button label="Add Permission" icon="pi pi-plus" severity="success" class="mr-2 mt-3"
                @click="addPermission" />
            <DataTable :value="userPermissions" tableStyle="min-width: 30rem" @rowReorder="onUserPermissionsRowReorder"
                scrollable scroll-height="500px">
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
                        <UserPermissionSelect v-model="slotProps.data.role"
                            :invalid="submitted && !slotProps.data.role" />
                        <small class="p-error" v-if="submitted && !slotProps.data.role">Role is required.</small>
                    </template>
                </Column>
                <Column style="width: auto; margin: 0; padding: 0%" v-if="userPermissions.length > 1">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" text rounded severity="danger"
                            @click="onUserPermissionDelete(slotProps.index)" />
                    </template>
                </Column>
            </DataTable>
        </Panel>
        <Panel class="grid-item" header="Code System Roles">
            <Button label="Add Role" icon="pi pi-plus" severity="success" class="mr-2 mt-3" @click="addRole" />
            <DataTable :value="codeSystemRoles" tableStyle="min-width: 30rem" @rowReorder="onCodeSystemRowReorder"
                scrollable scroll-height="500px">
                <Column rowReorder headerStyle="width: 3rem" />
                <Column header="CodeSystem">
                    <template #body="slotProps">
                        <CodeSystemSelect v-model="slotProps.data.codeSystem" :codeSystems="codeSystems"
                            :invalid="submitted && !slotProps.data.codeSystem" />
                        <small class="p-error" v-if="submitted && !slotProps.data.codeSystem">CodeSystem is
                            required.</small>
                    </template>
                </Column>
                <Column header="Role">
                    <template #body="slotProps">
                        <RoleSelect v-model="slotProps.data.role" :invalid="submitted && !slotProps.data.role" />
                        <small class="p-error" v-if="submitted && !slotProps.data.role">Role is required.</small>
                    </template>
                </Column>
                <Column header="Name">
                    <template #body="slotProps">
                        <InputText v-model=slotProps.data.name placeholder="Name"
                            :invalid="submitted && !slotProps.data.name" />
                        <small class="p-error" v-if="submitted && !slotProps.data.name">Name is required.</small>
                    </template>
                </Column>
                <Column style="width: auto; margin: 0; padding: 0%" v-if="codeSystemRoles.length > 1">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" text rounded severity="danger"
                            @click="onCodeSystemDelete(slotProps.index)" />
                    </template>
                </Column>
            </DataTable>
        </Panel>
    </div>
    <div class="button-container">
        <Button label="Cancel" severity="danger" @click="onCancelProject" />
        <Button label="Create Project" class="mr-2" severity="success" @click="onCreateProject" />
    </div>

</template>

<script setup lang="ts">
import CodeSystemSelect from '@/components/selects/CodeSystemSelect.vue';
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useGetCodeSystemsQuery, usePostProjectQuery } from '@/composables/queries/project-query';
import { type CodeSystem, type CreateProject } from '@/stores/project';
import Checkbox from 'primevue/checkbox';
import { useRouter } from 'vue-router';

const submitted = ref(false);

// for possible error messages
const toast = useToast();

/////////// user permissions
const userPermissions = ref([
    {
        user: {
            name: 'John Doe',
            email: 'john.doe@fau.de',
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
        },
        role: ''
    },
    {
        user: {
            name: 'Jane Doe',
            email: 'jane.doe@fau.de',
            id: 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a20'
        }
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
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
        },
        role: ''
    });
};

/////////// code system roles
const codeSystemRoles = ref([
    {
        codeSystem: 0,
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
    description: '',
    equivalence_required: false,
    status_required: false
});

const router = useRouter();

const onCreateProject = () => {
    submitted.value = true;
    if (!project.value.name || !project.value.version || !project.value.description) {
        console.log("invalid: project name, version or description missing");
        return;
    }
    for (const permission of userPermissions.value) {
        if (!permission.role) {
            console.log("invalid: each permission needs a role");
            return;
        }
    }
    for (const role of codeSystemRoles.value) {
        if (!role.codeSystem || !role.role || !role.name) {
            console.log("invalid: each code system role needs a code system, role and name");
            return;
        }
    }

    const createProject: CreateProject = {
        name: project.value.name,
        version: project.value.version,
        description: project.value.description,
        equivalence_required: project.value.equivalence_required,
        status_required: project.value.status_required,
        project_permissions: userPermissions.value.map((permission) => {
            return {
                user_id: permission.user.id,
                role: permission.role
            }
        }),
        code_system_roles: codeSystemRoles.value.map((role) => {
            return {
                system: role.codeSystem.id,
                type: role.role,
                name: role.name
            }
        })
    };

    const { error, isFetching, isReady, state, execute } = usePostProjectQuery(createProject);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (isReady.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Project created successfully', life: 10000 });
                router.push('/dashboard/');
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: `Could not create Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
            }
        }
    })
    execute();
}

const onCancelProject = () => {
    router.push('/dashboard/');
}


</script>

<style scoped>
.grid-container {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: min-content;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
}

.grid-item {
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
}

/* stack on smaller screens */
@media (max-width: 1000px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}
</style>