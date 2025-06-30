<template>
    <div class="grid-container-one">
        <Panel class="grid-item">
            <template #header>
                <h1 class="text-2xl m-0">Migration</h1>
            </template>
            <template #icons>
                <div class="flex space-x-2">
                    <Button icon="pi pi-book" label="Concept Browser" severity="help" @click="openConceptBrowser()"/>
                    <Button icon="pi pi-check" label="Finish Migration" severity="success" @click="finishMigration(projectId)"
                        :disabled="!userHasPermission(StartMigrationPermission, projectStore, authStore) || !canBeFinished"
                        v-tooltip.top="addDisableTooltip(StartMigrationPermission)" />
                    <Button icon="pi pi-times" label="Cancel Migration" severity="danger" @click="cancelMigration(projectId)"
                        :disabled="!userHasPermission(StartMigrationPermission, projectStore, authStore)"
                        v-tooltip.top="addDisablePermissionTooltip(StartMigrationPermission)" />
                    <Button icon="pi pi-pencil" label="Edit project" @click="editProjectView(projectId)"
                        :disabled="!userHasPermission(ProjectUpdatePermission, projectStore, authStore)"
                        v-tooltip.top="addDisablePermissionTooltip(ProjectUpdatePermission)" />
                </div>
            </template>

            <div>There is currently a migration in progress for this project:</div>
            <div class="mt-3" style="display: flex; gap: 10px;">
                <RoleTag :value="codeSystemRole.type" />
                <span>{{ codeSystemRole.system.name }}</span>
                <span v-if="codeSystemRole.name">({{ codeSystemRole.name }})</span>
                <Tag :value="`${codeSystemRole.system.version.version_name} (${codeSystemRole.system.version.release_date })`" severity="secondary" />
                <i class="pi pi-arrow-right content-center"></i>
                <Tag :value="`${codeSystemRole.system.next_version!.version_name} (${codeSystemRole.system.next_version!.release_date })`" severity="secondary" />
            </div>
            <div class="mt-3">
                <span class="me-3">All mappings that use concepts that have been changed or deleted in the new version must be reviewed.</span>
                <Button type="button" icon="pi pi-info" severity="secondary" rounded style="border: solid 1px; width: 1.5rem; height: 1.5rem;" @click="toggle" />
                <Popover ref="op" class="mx-4" style="max-width: 75%">
                    <p class="mb-3">The concepts requiring a review are ordered in tabs according to the type of change (e.g. concept deleted or meaning changed).</p>
                    <p class="mb-3">For each concept, you can select an option that will be applied to all mappings. Additionally, you can select an option individually for each mapping.</p>
                    <p class="mb-3">The following options are available:
                        <ul class="circle-list">
                            <li>Review Later: Do not select an option at this time, postpone review until later</li>
                            <li>Replace Concept: Replace the concept with another concept</li>
                            <li>Accept changes (if the concept has not been deleted): Accept changes to the concept and leave the mappings as they are</li>
                            <li>Delete mappings: Permanently delete mappings</li>
                        </ul>
                    </p>
                    <p>Any changes made during the review process will be applied when the migration is finished.</p>
                    <Message severity="error" class="mt-3">Deleting a mapping is performed immediately and cannot be undone.</Message>
                </Popover>
            </div>

            <DataTable v-if="isLoading" :value="loadingPlaceholder">
                <Column v-for="_ in 5" :key="_" header="">
                    <template #body>
                        <Skeleton></Skeleton>
                    </template>
                </Column>
            </DataTable>

            <Message v-else-if="error" class="mt-3" severity="error" :closable="false">{{ error.message }}</Message>

            <div v-else-if="canBeFinished" class="mt-3">
                <Message severity="success" :closable="false">All changes are reviewed. You can finish the migration.</Message>
            </div>

        </Panel>

        <Panel v-if="!isLoading && !error && !canBeFinished && migrationChanges" class="grid-item">
            <template #header>
                <h1 class="text-2xl m-0">Concepts that need a review</h1>
            </template>
            <template #icons>
                <div class="flex space-x-2">
                    <Button icon="pi pi-check" label="Save Changes" severity="success" @click="saveChanges(projectId)"
                        :disabled="!userHasPermission(MigrationPermission, projectStore, authStore)" />
                </div>
            </template>

            <div>
                <Stepper :value="stepperValue">
                    <StepList>
                        <Step v-if="migrationChanges.deleted.length != 0" :value="stepperValues[0]">Deleted Concepts</Step>
                        <Step v-if="migrationChanges.deprecated.length != 0" :value="stepperValues[1]">Deprecated Concepts</Step>
                        <Step v-if="migrationChanges.discouraged.length != 0" :value="stepperValues[2]">Discouraged Concepts</Step>
                        <Step v-if="migrationChanges.change_display.length != 0" :value="stepperValues[3]">Meaning Changed</Step>
                        <Step v-if="migrationChanges.change_description.length != 0" :value="stepperValues[4]">Description Changed</Step>
                    </StepList>
                    <StepPanels>
                        <StepPanel v-if="migrationChanges.deleted.length != 0" :value="stepperValues[0]">
                            <MigrationAccordion ref="deletedAccordion" :migrationChanges="migrationChanges" :roleId="codeSystemRole.id" changesType="deleted" />
                        </StepPanel>
                        <StepPanel v-if="migrationChanges.deprecated.length != 0" :value="stepperValues[1]">
                            <MigrationAccordion ref="deprecatedAccordion" :migrationChanges="migrationChanges" :roleId="codeSystemRole.id" changesType="deprecated" />
                        </StepPanel>
                        <StepPanel v-if="migrationChanges.discouraged.length != 0" :value="stepperValues[2]">
                            <MigrationAccordion ref="discouragedAccordion" :migrationChanges="migrationChanges" :roleId="codeSystemRole.id" changesType="discouraged" />
                        </StepPanel>
                        <StepPanel v-if="migrationChanges.change_display.length != 0" :value="stepperValues[3]">
                            <MigrationAccordion ref="meaningAccordion" :migrationChanges="migrationChanges" :roleId="codeSystemRole.id" changesType="meaning" />
                        </StepPanel>
                        <StepPanel v-if="migrationChanges.change_description.length != 0" :value="stepperValues[4]">
                            <MigrationAccordion ref="descriptionAccordion" :migrationChanges="migrationChanges" :roleId="codeSystemRole.id" changesType="description" />
                        </StepPanel>
                    </StepPanels>
                </Stepper>
            </div>
        </Panel>
    </div>
</template>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Popover from 'primevue/popover';
import MigrationAccordion from '@/views/loggedIn/Migration/MigrationAccordion.vue';

import { computed, ref, watch, type PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useCancelMigrationQuery, useFinishMigrationQuery, useGetMigrationChangesQuery, useMigrateMigrationQuery, type MigrateMapping, type MigrationChanges, type MigrationStatus } from '@/composables/queries/project-migration-query';
import { userHasPermission, getPermissionTooltip, StartMigrationPermission, MigrationPermission, ProjectUpdatePermission } from '@/lib/permissions';
import { useProjectStore, type ProjectRole } from '@/stores/project';
import { useAuthStore } from '@/stores/auth';
import { getCancelMigrationConfirmationOptions } from "@/utils/popupOptions";
import { useGetProjectDetailsQuery } from '@/composables/queries/project-query';

const props = defineProps({
    projectId: {
        type: Number,
        required: true,
    },
    migrationStatus: {
        type: Object as PropType<MigrationStatus>,
        required: true,
    }
});

const projectStore = useProjectStore();
const authStore = useAuthStore();
const confirm = useConfirm();
const router = useRouter();
const toast = useToast();
const route = useRoute();

const addDisablePermissionTooltip = (permission: ProjectRole[]) => {
  return getPermissionTooltip(permission, projectStore, authStore);
};

const addDisableTooltip = (permission: ProjectRole[]) => {
  const permissionTooltip = getPermissionTooltip(permission, projectStore, authStore);
  if (permissionTooltip != '') {
    return permissionTooltip;
  }
  if (!canBeFinished.value) {
    return 'Please review all changes before finishing the migration.';
  }
  return '';
};

const loadingPlaceholder = ref(new Array(4));

const codeSystemRole = props.migrationStatus.code_system_role!;

const migrationChanges = ref<MigrationChanges | null>(null);
const canBeFinished = computed(() => {
    if (!migrationChanges.value) return false;
    return migrationChanges.value.deleted.length === 0 && migrationChanges.value.deprecated.length === 0 && migrationChanges.value.discouraged.length === 0
        && migrationChanges.value.change_display.length === 0 && migrationChanges.value.change_description.length === 0;
});
const stepperValues = computed(() => {
    let currentStep = 1;
    const result = [11, 12, 13, 14, 15];
    if (migrationChanges.value) {
        if (migrationChanges.value.deleted.length != 0) {
            result[0] = currentStep++;
        }
        if (migrationChanges.value.deprecated.length != 0) {
            result[1] = currentStep++;
        }
        if (migrationChanges.value.discouraged.length != 0) {
            result[2] = currentStep++;
        }
        if (migrationChanges.value.change_display.length != 0) {
            result[3] = currentStep++;
        }
        if (migrationChanges.value.change_description.length != 0) {
            result[4] = currentStep++;
        }
    }
    return result;
});
const stepperValue = computed(() => {
    if (migrationChanges.value) {
        return 1;
    }
    return 0;
});

const op = ref();
const toggle = (payload: MouseEvent) => {
    op.value.toggle(payload);
}

const isLoading = ref(true);
const error = ref<{ message: string } | undefined>(undefined);

const { isFetching: projectDetailsIsFetching, state: projectDetailsState, error: projectDetailsError, execute: executeProjectDetailsQuery } = useGetProjectDetailsQuery(Number(props.projectId));
const { isFetching: changesIsFetching, state: changesState, error: changesError, execute: executeChangesQuery } = useGetMigrationChangesQuery(props.projectId);
watch([projectDetailsIsFetching, changesIsFetching], ([newProjectFetching, newChangesFetching]) => {
    if (!newProjectFetching && !newChangesFetching) {
        if (projectDetailsError.value) {
            error.value = projectDetailsError.value;
        }
        if (changesError.value) {
            error.value = changesError.value;
        }
        isLoading.value = false;
        if (projectDetailsState.value && changesState.value) {
            migrationChanges.value = changesState.value;
            projectStore.setCurrentProjectDetails(projectDetailsState.value);
            if (projectDetailsState.value.project_permissions) {
                for (const role of projectDetailsState.value.project_permissions) {
                if (role.user.id === authStore.userInfo?.id) {
                    projectStore.setProjectRole(role.role);
                    break;
                }
                }
            }
        }
    }
});
executeProjectDetailsQuery();
executeChangesQuery();

const finishMigration = (projectId: number) => {
    const { isFetching, error, execute } = useFinishMigrationQuery(projectId);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (error.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.value.message, life: 10000 });
            } else {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Migration finished successfully', life: 10000 });
                router.push(`/projects/${projectId}`);
                window.location.reload();
            }
        }
    });
    execute();
}

const cancelMigration = (projectId: number) => {
    confirm.require(getCancelMigrationConfirmationOptions(() => {
        const { isFetching, error, execute } = useCancelMigrationQuery(projectId);
        watch(isFetching, (newVal) => {
            if (!newVal) {
                if (error.value) {
                    toast.add({ severity: 'error', summary: 'Error', detail: error.value.message, life: 10000 });
                } else {
                    toast.add({ severity: 'success', summary: 'Success', detail: 'Migration cancelled successfully', life: 10000 });
                    router.push(`/projects/${projectId}`);
                    window.location.reload();
                }
            }
        });
        execute();
    }));
}

const editProjectView = (projectId: number) => {
    router.push(`/projects/${projectId}/edit`);
};

const openConceptBrowser = () => {
    window.open(`${window.location.origin}${route.fullPath}/browser?role_id=${codeSystemRole.id}&version_id=${codeSystemRole.system.next_version?.id}`, '_blank', `popup=yes,width=${window.innerWidth},height=${window.innerHeight},resizable=yes,scrollbars=yes`);
};

const deletedAccordion = ref();
const deprecatedAccordion = ref();
const discouragedAccordion = ref();
const meaningAccordion = ref();
const descriptionAccordion = ref();
const saveChanges = (projectId: number) => {
    const migrations: MigrateMapping[] = [];
    if (deletedAccordion.value) {
        migrations.push(...deletedAccordion.value.getMigrations());
    }
    if (deprecatedAccordion.value) {
        migrations.push(...deprecatedAccordion.value.getMigrations());
    }
    if (discouragedAccordion.value) {
        migrations.push(...discouragedAccordion.value.getMigrations());
    }
    if (meaningAccordion.value) {
        migrations.push(...meaningAccordion.value.getMigrations());
    }
    if (descriptionAccordion.value) {
        migrations.push(...descriptionAccordion.value.getMigrations());
    }
    console.log('Migrations:', migrations);
    const { isFetching, error, execute } = useMigrateMigrationQuery(projectId, migrations);
    watch(isFetching, (newVal) => {
        if (!newVal) {
            if (error.value) {
                toast.add({ severity: 'error', summary: 'Error', detail: error.value.message, life: 10000 });
            } else {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Changes saved successfully', life: 10000 });
                router.push(`/projects/${projectId}`);
                window.location.reload();
            }
        }
    });
    execute();
};

</script>

<style scoped>

.grid-container-one {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

.circle-list {
    list-style-type: disc;
    padding-left: 2rem;
}
</style>