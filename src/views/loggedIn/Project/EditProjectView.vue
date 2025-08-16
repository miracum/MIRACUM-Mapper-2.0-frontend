<template>
    <div class="grid-container">
        <BasicProjectPanel :project="project" :submitted="submitted" header="Edit Project" description="Edit an existing Mapping Project" />
        <StatusEquivalencePanel :project="project" :submitted="submitted" :isDisabled="disabled" />
        <ProjectPermissionsPanel :project="project" :userPermissions="userPermissions" :submitted="submitted" />
        <!--@update:userPermissions="updateUserPermissions"-->
        <CodeSystemRolesPanel :project="project" :codeSystemRoles="codeSystemRoles" :submitted="submitted"
            :rowReorderPossible="rowReorderPossible" /> <!--@update:codeSystemRoles="updateCodeSystemRoleOrder"-->
    </div>
    <div class="button-container">
        <Button label="Done" severity="secondary" @click="onProjectDone" />
        <!-- <Button label="Create Project" class="mr-2" severity="success" @click="onCreateProject" /> -->
    </div>

</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { onMounted, ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { useGetProjectDetailsQuery, usePutProjectQuery, usePutCodeSystemRoleQuery, usePutProjectPermissionQuery, usePostProjectPermissionQuery, useDeleteProjectPermissionQuery } from '@/composables/queries/project-query';
import { type UpdateCodeSystemRole, type UpdateProject, type ProjectPermission } from '@/stores/project'

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    }
});
const projectId = Number(props.projectId);

const submitted = ref(false);
const disabled = true;
const rowReorderPossible = false;

// for possible error messages
const toast = useToast();

const projectStore = useProjectStore();

const project = ref({
    name: '',
    version: '',
    description: '',
    equivalence_required: true,
    status_required: true
});

const userPermissions = ref([] as { user: { fullname: string, email: string, id: string, username: string }, role: string }[]);

const codeSystemRoles = ref([] as { codeSystem: { codeSystemName: string, id: number, versionName: string }, role: string, name: string, id: number }[]);

const getProjectDetails = async () => {
    const { state, isReady, isFetching, error, execute } = useGetProjectDetailsQuery(projectId);
    execute();
    await new Promise<void>((resolve) => {
        watch(isFetching, (newVal) => {
            if (!newVal && isReady.value) {
                projectStore.setCurrentProjectDetails(state.value);
                resolve();
            }
        });
    })

    const projectDetails = projectStore.currentProjectDetails;
    project.value.name = projectDetails.name
    project.value.version = projectDetails.version
    project.value.description = projectDetails.description
    project.value.equivalence_required = projectDetails.equivalence_required
    project.value.status_required = projectDetails.status_required

    const permissions = projectDetails.project_permissions
    if (permissions) {
        permissions.forEach(permission => {
            userPermissions.value.push({
                user: {
                    fullname: permission.user.fullname ? permission.user.fullname : '',
                    username: permission.user.username,
                    id: permission.user.id,
                    email: permission.user.email ? permission.user.email : ''
                },
                role: permission.role
            });
        });
    }

    const roles = projectDetails.code_system_roles
    roles.forEach(codeSystemRole => {
        if (!codeSystemRole.name) {
            codeSystemRole.name = '';
        }
        codeSystemRoles.value.push({
            codeSystem: {
                id: codeSystemRole.system.id,
                versionName: codeSystemRole.system.version.version_name,
                codeSystemName: codeSystemRole.system.name
            },
            role: codeSystemRole.type,
            name: codeSystemRole.name,
            id: codeSystemRole.id
        });
    });
}

// copy old project information
let oldProject = {
    name: '',
    version: '',
    description: '',
    equivalence_required: true,
    status_required: true
};
let oldUserPermissions = [] as { user: { fullname: string, email: string, id: string, username: string }, role: string }[];
let oldCodeSystemRoles = [] as { codeSystem: { codeSystemName: string, id: number, name: string }, role: string, name: string, id: number }[];
const copyOldProjectDetails = () => {
    oldProject = JSON.parse(JSON.stringify(project.value));
    oldUserPermissions = JSON.parse(JSON.stringify(userPermissions.value));
    oldCodeSystemRoles = JSON.parse(JSON.stringify(codeSystemRoles.value));
}


// const updateCodeSystemRoleOrder = (newCodeSystemRolesOrder: Array<{ codeSystem: number; role: string, name: string }>) => {
//     codeSystemRoles.value = newCodeSystemRolesOrder;
// }


const router = useRouter();
const onProjectDone = () => {
    // validate that no required data is missing
    submitted.value = true;
    if (!project.value.name || !project.value.version || !project.value.description) {
        // console.log("invalid: project name, version or description missing");
        return;
    }
    const userMap = new Map<string, boolean>();
    for (const permission of userPermissions.value) {
        if (!permission.role) {
            // console.log("invalid: each permission needs a role");
            return;
        }
        if (userMap.has(permission.user.id)) {
            // console.log("invalid: each user can only have one permission");
            return;
        }
        userMap.set(permission.user.id, true);
    }
    for (const role of codeSystemRoles.value) {
        if (!role.codeSystem || !role.role) {
            // console.log("invalid: each code system role needs a code system, role and name");
            return;
        }
    }

    // update project information
    if (project.value.name !== oldProject.name ||
        project.value.description !== oldProject.description ||
        project.value.version !== oldProject.version) {
        const newProject: UpdateProject = {
            name: project.value.name,
            version: project.value.version,
            description: project.value.description,
            equivalence_required: project.value.equivalence_required,
            status_required: project.value.status_required,
            id: projectId
        }
        const { error, isFetching, isReady, state, execute } = usePutProjectQuery({ body: newProject });
        watch(isFetching, (newVal) => {
            if (!newVal) {
                if (isReady.value) {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Project information updated successfully', life: 10000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Project due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                }
            }
        })
        execute();
    }

    // update codesystemroles
    if (codeSystemRoles.value !== oldCodeSystemRoles) {
        const oldCodeSystemRolesMap = new Map();
        oldCodeSystemRoles.forEach(role => {
            oldCodeSystemRolesMap.set(role.id, role);
        });
        codeSystemRoles.value.forEach(codeSystemRole => {
            const oldCodeSystemRole = oldCodeSystemRolesMap.get(codeSystemRole.id);
            if (oldCodeSystemRole && (      // codesystem of codesystemrole cannot be changed
                codeSystemRole.role !== oldCodeSystemRole.role ||
                codeSystemRole.name !== oldCodeSystemRole.name)) {
                const newCodeSystemRole: UpdateCodeSystemRole = {
                    type: codeSystemRole.role,
                    name: codeSystemRole.name,
                    id: codeSystemRole.id
                };
                const { error, isFetching, isReady, state, execute } = usePutCodeSystemRoleQuery(newCodeSystemRole, projectId);
                watch(isFetching, (newVal) => {
                    if (!newVal) {
                        if (isReady.value) {
                            toast.add({ severity: 'success', summary: 'Success', detail: `Codesystemrole ${codeSystemRole.id} updated successfully`, life: 10000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Codesystemrole ${codeSystemRole.id} due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                        }
                    }
                });
                execute()
            }
        });

        //TODO add delete/create functionality as soon as this feature has to be implemented
    }

    // update or delete existing roles, create new roles
    if (userPermissions.value !== oldUserPermissions) {
        const oldPermissionsMap = new Map();
        oldUserPermissions.forEach(permission => {
            oldPermissionsMap.set(permission.user.id, permission);
        });
        const permissionsMap = new Map();
        userPermissions.value.forEach(permission => {
            permissionsMap.set(permission.user.id, permission);
        });

        userPermissions.value.forEach(permission => {
            if (permission.user.fullname == "") {
                permission.user.fullname = permission.user.username;
            }
            const oldPermission = oldPermissionsMap.get(permission.user.id);
            if (oldPermission) {    // permission already existed
                // Check if the permission has changed
                if (permission.role !== oldPermission.role) {
                    const updatedPermission: ProjectPermission = {
                        user_id: permission.user.id,
                        role: permission.role,
                    };
                    const { error, isFetching, isReady, state, execute } = usePutProjectPermissionQuery(updatedPermission, projectId);
                    watch(isFetching, (newVal) => {
                        if (!newVal) {
                            if (isReady.value) {
                                toast.add({ severity: 'success', summary: 'Success', detail: `Permission for ${permission.user.fullname} updated successfully`, life: 10000 });
                            } else {
                                toast.add({ severity: 'error', summary: 'Error', detail: `Could not update Permission for ${permission.user.fullname} due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                            }
                        }
                    });
                    execute();
                }
            } else {    // permission is new and has to be created
                // Todo test if works as soon as keycloak is deployed
                const newPermission: ProjectPermission = {
                    user_id: permission.user.id,
                    role: permission.role,
                };
                const { error, isFetching, isReady, state, execute } = usePostProjectPermissionQuery(newPermission, projectId);
                watch(isFetching, (newVal) => {
                    if (!newVal) {
                        if (isReady.value) {
                            toast.add({ severity: 'success', summary: 'Success', detail: `Permission for ${permission.user.fullname} created successfully`, life: 10000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: `Could not create Permission for ${permission.user.fullname} due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                        }
                    }
                });
                execute();
            }
        });

        // check for permissions that got deleted
        oldUserPermissions.forEach(permission => {
            if (!permissionsMap.has(permission.user.id)) {
                const { error, isFetching, isReady, state, execute } = useDeleteProjectPermissionQuery(permission.user.id, projectId);
                watch(isFetching, (newVal) => {
                    if (!newVal) {
                        if (permission.user.fullname == "") {
                            permission.user.fullname = permission.user.username;
                        }
                        if (isReady.value) {
                            toast.add({ severity: 'success', summary: 'Success', detail: `Permission for ${permission.user.fullname} deleted successfully`, life: 10000 });
                        } else {
                            toast.add({ severity: 'error', summary: 'Error', detail: `Could not delete Permission for ${permission.user.fullname} due to an server error: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: 10000 });
                        }
                    }
                });
                execute();
            }
        });
    }

    router.push(`/projects/${projectId}`);
}


onMounted(async () => {
    await getProjectDetails();
    copyOldProjectDetails();
});

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