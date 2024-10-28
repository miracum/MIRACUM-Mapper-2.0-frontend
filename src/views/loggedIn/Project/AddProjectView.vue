<template>
    <div class="grid-container">
        <BasicProjectPanel :project="project" :submitted="submitted" />
        <StatusEquivalencePanel :project="project" :submitted="submitted" />
        <ProjectPermissionsPanel :project="project" :userPermissions="userPermissions" :submitted="submitted" />
        <!--@update:userPermissions="updateUserPermissions"-->
        <CodeSystemRolesPanel :project="project" :codeSystemRoles="codeSystemRoles" :submitted="submitted"
            @update:codeSystemRoles="updateCodeSystemRoleOrder" editCodeSystemRolesPossible=true />
    </div>
    <div class="button-container">
        <Button label="Cancel" severity="danger" @click="onCancelProject" />
        <Button label="Create Project" class="mr-2" severity="success" @click="onCreateProject" />
    </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { usePostProjectQuery } from '@/composables/queries/project-query';
import { type CreateProject } from '@/stores/project';
import { useRouter } from 'vue-router';

const submitted = ref(false);

// for possible error messages
const toast = useToast();

/////////// user permissions
// const userPermissions2 = ref([
//     {
//         user: {
//             name: 'John Doe',
//             email: 'john.doe@fau.de',
//             id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
//         },
//         role: ''
//     },
//     {
//         user: {
//             name: 'Jane Doe',
//             email: 'jane.doe@fau.de',
//             id: 'b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a20'
//         }
//     }
// ]);

// TODO only id is enough?
const userPermissions = ref([
    {
        user: {
            name: "",
            email: "",
            id: ""
        }
    }
])

// const updateUserPermissions = (newPermission) => {
//     userPermissions.value = newPermissions;
// }

/////////// code system roles
const codeSystemRoles = ref([
    {
        codeSystem: 0,
        role: '',
        name: ''
    }

]);

const updateCodeSystemRoleOrder = (newCodeSystemRolesOrder: Array<{ codeSystem: number; role: string, name: string }>) => {
    codeSystemRoles.value = newCodeSystemRolesOrder;
}


/////////// general information
const project = ref({
    name: '',
    version: '',
    description: '',
    equivalence_required: true,
    status_required: true
});

const router = useRouter();

const onCreateProject = () => {
    submitted.value = true;
    if (!project.value.name || !project.value.version || !project.value.description) {
        console.log("invalid: project name, version or description missing");
        return;
    }
    const userMap = new Map<string, boolean>();
    for (const permission of userPermissions.value) {
        if (!permission.role) {
            console.log("invalid: each permission needs a role");
            return;
        }
        if (userMap.has(permission.user.id)) {
            console.log("invalid: each user can only have one permission");
            return;
        }
        userMap.set(permission.user.id, true);
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
                user_id: permission.user.id.id,
                //user_id: a,
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

.p-error {
    display: block;
}
</style>