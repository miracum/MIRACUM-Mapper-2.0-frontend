<template>
    <Menubar :model="items" styleClass="centeredMenuBar">
        <template #start>
            <div class="header-container">
                <img src="@/assets/logo.png" alt="Logo" width="50" class="logo-margin" />
                <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
                <div class="divider mx-2"></div>
                <Navigator />
            </div>
        </template>
        <template #item="{ item, props }">
            <router-link v-if="!item.admin || authStore.isAdmin" v-slot="{ href, navigate }" :to="item.route" custom>
                <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
            </router-link>
        </template>
        <template #end>
            <div class="avatar-container">
                <AvatarMenuPopup />
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css';
import AvatarMenuPopup from '@/components/shared/AvatarMenuPopup.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const items = ref([
    {
        label: 'Projects',
        icon: authStore.isAdmin ? 'pi pi-folder' : 'pi pi-home',
        route: '/projects',
        admin: false,
    },
    {
        label: 'Codesystems',
        icon: 'pi pi-book',
        route: '/codesystems',
        admin: true,
    }
])


</script>

<style scoped>
.p-menubar {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
}

.header-container {
    display: flex;
    align-items: center;
}

.avatar-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.logo-margin {
    margin-right: 10px;
}
</style>