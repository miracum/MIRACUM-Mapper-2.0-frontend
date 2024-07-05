<template>
    <!-- <div class="card"> -->
    <Menubar :model="items">
        <template #start>
            <div class="header-container">
                <img src="@/assets/logo.png" alt="Logo" width="55" />
                <Navigator />
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
                <Avatar icon="pi pi-user" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261"
                    shape="circle" />
            </div>
        </template>
    </Menubar>
    <!-- </div> -->
</template>

<script setup>
import 'primeicons/primeicons.css';

// Define props
const props = defineProps({
    items: Array
});

</script>

<style scoped>
/* If your header has a specific class, replace `.header` with that class name or use an id */
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
    /* Optional, depending on your layout needs */
}
</style>