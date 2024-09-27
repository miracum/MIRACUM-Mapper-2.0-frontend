<template>
    <!-- <div class="card"> -->

    <Menubar :model="props.items">
        <template #start>
            <div class="header-container">
                <img src="@/assets/logo.png" alt="Logo" width="50" class="logo-margin" />
                <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
                <div class="divider mx-2"></div>
                <Suspense>
                    <Navigator />
                </Suspense>
            </div>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
            <a class="flex items-center" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                <span v-if="item.shortcut"
                    class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                        item.shortcut }}</span>
                <i v-if="hasSubmenu"
                    :class="['pi pi-angle-down', { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }]"></i>
            </a>
        </template>
        <template #end>
            <div class="avatar-container">
                <AvatarMenuPopup />
            </div>
        </template>
    </Menubar>
</template>

<script setup>
import 'primeicons/primeicons.css';
import AvatarMenuPopup from '@/components/shared/AvatarMenuPopup.vue';
// import { ref } from "vue";


const props = defineProps({
    items: Array
});

// const avatarItems = ref([
//     {
//         label: 'Options',
//         items: [
//             {
//                 label: 'Refresh',
//                 icon: 'pi pi-refresh'
//             },
//             {
//                 label: 'Export',
//                 icon: 'pi pi-upload'
//             }
//         ]
//     }
// ]);

</script>

<style scoped>
.p-menubar {
    display: flex;
    /* Ensure Menubar is a flex container */
    justify-content: space-between;
    /* Space between start and end templates */
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
}

.header-container {
    display: flex;
    align-items: center;
    /* Adjusts space between items, pushing them to start and end */
}

.avatar-container {
    display: flex;
    justify-content: flex-end;
    /* Aligns the Avatar to the end */
    width: 100%;
}

.logo-margin {
    margin-right: 10px;
}
</style>