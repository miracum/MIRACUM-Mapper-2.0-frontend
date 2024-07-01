<template>
    <Breadcrumb :home="home" :model="navItems">
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
import { ref } from "vue";
// import 'primeicons/primeicons.css';

const home = ref({
    icon: 'pi pi-home',
    route: '/dashboard'
});
const navItems = ref([
    { label: 'Project', route: '/dashboard' },
    { label: 'Details', route: '/dashboard' },
]);

</script>