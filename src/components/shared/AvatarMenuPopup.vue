<template>
    <Button text @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
        <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
            shape="circle" />
    </Button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
        <template #start>
            <span class="inline-flex align-items-center gap-1 px-2 py-2">
                <img src="@/assets/logo.png" alt="Logo" width="40" />
                <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
            </span>
            <!-- <ThemeSwitcher /> -->
        </template>
        <template #submenuheader="{ item }">
            <div class="flex flex-col">
                <span class="text-primary font-bold">{{ item.label }}</span>
                <span class="text-xs">{{ item.subtitle }}</span>
            </div>
        </template>
        <template #item="{ item, props }">
            <a class="flex align-items-center" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                <span v-if="item.shortcut"
                    class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut
                    }}</span>
            </a>
        </template>
        <template #end>
            <div class="inline-flex align-items-center gap-1 px-2 py-2">
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
                    shape="circle" />
                <span class="inline-flex flex-col items-start">
                    <span class="font-bold">{{ displayName }}</span>
                    <span class="text-sm">{{ displayEmail }}</span>
                </span>
            </div>
        </template>
    </Menu>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const authStore = useAuthStore();

const menu = ref();

const toggle = (event: MouseEvent) => {
    menu.value.toggle(event);
};

const items = ref([
    {
        separator: true
    },
    {
        label: 'Profile',
        icon: 'pi pi-cog',
        subtitle: `Role: ${authStore.isAdmin ? 'Admin' : 'Normal User'}`,
        items: [
            {
                label: 'Copy Auth Token',
                icon: 'pi pi-copy',
                command: copyAuthToken
            },
            {
                label: 'Sign Out',
                icon: 'pi pi-sign-out ',
                command: logoutAndNavigate
            }
        ]
    },
    {
        separator: true
    }
]);

const displayName = computed(() => {
    const { firstName, lastName, username } = authStore.userInfo;
    return firstName && lastName ? `${firstName} ${lastName}` : username;
});

const displayEmail = computed(() => {
    return authStore.userInfo.email || "no email provided";
});

function copyAuthToken() {
    const authToken = authStore.user.token ?? '';
    navigator.clipboard.writeText(authToken).then(() => {
        console.log('Auth token copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy auth token: ', err);
    });
}

function logoutAndNavigate() {
    authStore.logout();
    router.push('/');
}
</script>