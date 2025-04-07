<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <Breadcrumb :home="{}" :model="navItems" class="p-panel">
        <template #item="{ item, props }">
            <router-link v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate; navItems = []">
                    <span :class="[item.icon]" />
                    <span class="">{{ item.label }}</span>
                </a>
            </router-link>
        </template>
    </Breadcrumb>
</template>

<script setup lang="ts">
import { type Ref, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useProjectStore } from "@/stores/project"
import { useCodeSystemStore } from "@/stores/codesystem";

const home = ref({
    icon: 'pi pi-home',
    route: '/'
});

const projectStore = useProjectStore();
const codeSystemStore = useCodeSystemStore();
const route = useRoute();

const navItems: Ref<Array<{label: string; route: string;}>> = ref([]);

watchEffect(async () => {
    const pathSegments = route.path.split('/').filter(Boolean);
    if (pathSegments.length === 0) {
        navItems.value = [];
        return;
    }
    const segment1 = pathSegments[0];
    if (segment1 === 'projects') {
        // /projects/...
        navItems.value = [{
            label: 'Projects',
            route: '/projects'
        }];
        if (pathSegments.length === 1) {
            return;
        }
        const segment2 = pathSegments[1];
        if (segment2 === 'add') {
            // /projects/add
            navItems.value.push({
                label: 'Add',
                route: '/projects/add'
            });
        } else {
            // /projects/{id} or /projects/{id}/edit
            const projectId = parseInt(segment2);
            if (isNaN(projectId)) {
                return;
            }
            // get project name
            const project = projectStore.getProject(projectId);
            if (!project) {
                return;
            }
            navItems.value.push({
                label: project.name,
                route: `/projects/${projectId}`
            });
            if (pathSegments.length === 2) {
                return;
            }
            const segment3 = pathSegments[2];
            if (segment3 === 'edit') {
                // /projects/{id}/edit
                navItems.value.push({
                    label: 'Edit',
                    route: `/projects/${projectId}/edit`
                });
            } else {
                return;
            }
        }
    } else if (segment1 === 'codesystems') {
        // /codesystems/...
        navItems.value = [{
            label: 'Codesystems',
            route: '/codesystems'
        }];
        if (pathSegments.length === 1) {
            return;
        }
        const segment2 = pathSegments[1];
        if (segment2 === 'add') {
            // /codesystems/add
            navItems.value.push({
                label: 'Add',
                route: '/codesystems/add'
            });
        } else {
            // /codesystems/{id} or /codesystems/{id}/edit or /codesystems/{id}/import/{versionId}
            const codeSystemId = parseInt(segment2);
            if (isNaN(codeSystemId)) {
                return;
            }
            // get codesystem name
            const codeSystem = codeSystemStore.getCodeSystem(codeSystemId);
            if (!codeSystem) {
                return;
            }
            navItems.value.push({
                label: codeSystem.name,
                route: `/codesystems/${codeSystemId}`
            });
            if (pathSegments.length === 2) {
                return;
            }
            const segment3 = pathSegments[2];
            if (segment3 === 'edit') {
                // /codesystems/{id}/edit
                navItems.value.push({
                    label: 'Edit',
                    route: `/codesystems/${codeSystemId}/edit`
                });
            } else if (segment3 === 'import') {
                // /codesystems/{id}/import/{versionId}
                if (pathSegments.length === 3) {
                    return;
                }
                const segment4 = pathSegments[3];
                const codeSystemVersionId = parseInt(segment4);
                if (isNaN(codeSystemVersionId)) {
                    return;
                }
                // get codesystem version name
                const codeSystemVersion = codeSystemStore.getVersion(codeSystemId, codeSystemVersionId);
                if (!codeSystemVersion) {
                    return;
                }
                navItems.value.push({
                    label: ` Import ${codeSystemVersion.version_name}`,
                    route: `/codesystems/${codeSystemId}/import/${codeSystemVersionId}`
                });
            } else {
                return;
            }
        }
    } else {
        navItems.value = [];
        return;
    }
});
</script>