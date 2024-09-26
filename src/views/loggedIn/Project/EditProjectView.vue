<template>
    <div class="grid-container">
        <BasicProjectPanel :project="project" :submitted="submitted" />
        <StatusEquivalencePanel :project="project" :submitted="submitted" :isDisabled="disabled" />
        <ProjectPermissionsPanel :project="project" :userPermissions="userPermissions" :submitted="submitted" />
        <!--@update:userPermissions="updateUserPermissions"-->
        <CodeSystemRolesPanel :project="project" :codeSystemRoles="codeSystemRoles" :submitted="submitted"
            @update:codeSystemRoles="updateCodeSystemRoleOrder" :rowReorderPossible="rowReorderPossible" />
    </div>
    <div class="button-container">
        <Button label="Done" severity="secondary" @click="onFinishProject" />
        <!-- <Button label="Create Project" class="mr-2" severity="success" @click="onCreateProject" /> -->
    </div>

</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { useGetProjectDetailsQuery } from '@/composables/queries/project-query';

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

const projectStore = useProjectStore();

const project = ref({
    name: '',
    version: '',
    description: '',
    equivalence_required: true,
    status_required: true
});

const userPermissions = ref([] as { user: { name: string, email: string, id: string }, role: string }[]);

const codeSystemRoles = ref([] as { codeSystem: { codeSystemName: string, id: number, name: string }, role: string, name: string }[]);

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
                    name: permission.user_name,
                    id: permission.user_id,
                    email: "platzhalter@email.com"
                },
                role: permission.role
            });
        });
    }

    const roles = projectDetails.code_system_roles
    roles.forEach(codeSystemRole => {
        codeSystemRoles.value.push({
            codeSystem: {
                id: codeSystemRole.system.id,
                name: codeSystemRole.system.version,
                codeSystemName: codeSystemRole.system.name
            },
            role: codeSystemRole.type,
            name: codeSystemRole.name
        });
    });
}
getProjectDetails();

// for possible error messages
const toast = useToast();



const updateCodeSystemRoleOrder = (newCodeSystemRolesOrder: Array<{ codeSystem: number; role: string, name: string }>) => {
    codeSystemRoles.value = newCodeSystemRolesOrder;
}




const router = useRouter();
const onFinishProject = () => {
    router.push(`/dashboard/projects/${projectId}/mappings`);
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