<template>
    <Breadcrumb :home="home" :model="computedNavItems">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const home = ref({
    icon: 'pi pi-home',
    route: '/'
});

const route = useRoute();

const computedNavItems = computed(() => {
    let items = [];
    // Assuming you have a way to map routes to labels
    const routeToLabelMap = {
        // '/dashboard': 'Project',
        // '/projects/:projectId/mappings': 'Mappings',
        '/projects/:projectId/mappings': 'Project'
    };

    // Split the current path and build navigation items
    const pathSegments = route.path.split('/').filter(Boolean); // Remove empty segments
    let currentPath = '';
    for (const segment of pathSegments) {
        currentPath += `/${segment}`;
        // Check if the currentPath matches any predefined routes
        if (routeToLabelMap[currentPath]) {
            items.push({
                label: routeToLabelMap[currentPath],
                route: currentPath
            });
        }
    }

    return items;
});
</script>