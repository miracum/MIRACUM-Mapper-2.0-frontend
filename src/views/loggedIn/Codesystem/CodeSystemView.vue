<template>
    <Panel header="Codesystem Overview">
        <!-- Error State -->
        <Message v-if="error" severity="danger" :closable="false">{{ error.message }}</Message>

        <!-- Data View -->
        <CodeSystemListView :loading="isFetching" :data="codeSystems" />
    </Panel>
</template>

<script setup lang="ts">
import CodeSystemListView from "./CodeSystemListView.vue";
import { computed, } from 'vue';
import { useCodeSystemStore } from '@/stores/codesystem';

const store = useCodeSystemStore();

const { isFetching, error } = store.refreshState()

// A computed property is used here to get the codeSystems from the store. This is because the store is reactive and the computed property will update when the store updates.
const codeSystems = computed(() => store.codeSystems);

</script>