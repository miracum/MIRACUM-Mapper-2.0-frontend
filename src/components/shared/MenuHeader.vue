<template>
    <!-- <div class="card"> -->
        <Menubar :model="items">
            <template #start>
                <img src="@/assets/logo.png" alt="Logo" width="55" />
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
                <div class="flex align-items-center gap-2">
                    <Avatar icon=" pi pi-user" class="mr-2" size="large"
                        style="background-color: #ece9fc; color: #2a1261" shape="circle" />
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
    margin-top: 10px;
    /* Adjust the value as needed for spacing above */
    margin-left: 10px;
    /* Adjust the value as needed for spacing to the left */
    margin-right: 10px;
    /* Adjust the value as needed for spacing to the right */
}
</style>