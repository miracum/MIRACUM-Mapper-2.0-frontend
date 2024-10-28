<template>
    <Breadcrumb :home="home" :model="computedNavItems">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate; computedNavItems = []">
                    <span :class="[item.icon, 'text-color']" />
                    <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
            </a>
        </template>
    </Breadcrumb>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useProjectStore } from "@/stores/project";

const home = ref({
    icon: 'pi pi-home',
    route: '/'
});

const store = useProjectStore();
const route = useRoute();

const computedNavItems = ref([]);

watchEffect(async () => {
    // get projectId out of the path
    const pathSegments = route.path.split('/').filter(Boolean);
    const projectsIndex = pathSegments.indexOf("projects");
    if (projectsIndex === -1 || !(projectsIndex + 1 < pathSegments.length)) {
        return;
    }

    if (pathSegments[projectsIndex + 1] === 'add') {
        computedNavItems.value = [
            {
                label: 'Add',
                route: 'add'
            }
        ];
        return;
    }

    const projectId = pathSegments[projectsIndex + 1]

    // get project name
    if (!store.currentProjectDetails) {
        await store.fetchAndSetCurrentProjectDetails(projectId);
    }
    const projectName = store.currentProjectDetails.name;

    let items = [];
    const routeToLabelMap = {
        // '/dashboard': 'Project',
        // '/projects/:projectId/mappings': 'Mappings',
        'mappings': 'Project',
        'edit': 'Edit',
        // 'add': 'Add',
    };

    let currentPath = '';
    for (const segment of pathSegments) {
        // TODO very bad, just temporary
        if (routeToLabelMap[segment]) {
            if (segment === 'mappings') {
                currentPath += `/${segment}`;
                items.push({
                    label: projectName,
                    route: currentPath
                });
            } else if (segment === 'edit') {
                items.push({
                    label: projectName,
                    route: currentPath + "/mappings"
                });
                currentPath += `/${segment}`;
                items.push({
                    label: 'Edit',
                    route: currentPath
                });
            } else {
                items.push({
                    label: routeToLabelMap[segment],
                    route: currentPath
                });
            }
        } else {
            currentPath += `/${segment}`;
        }
    }

    computedNavItems.value = items
});
</script>