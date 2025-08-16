<template>
    <DataView :value="props.data" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" :dataKey="'id'"
        paginator :rows="20" :rowsPerPageOptions="[10, 20, 50, 100]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" scrollable scroll-height="calc(100vh - 430px)">
        <template #header>
            <div class="flex justify-content-between align-items-center">
                <!-- <div style="display: flex; gap: 10px; align-items: center;"> -->
                <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort by Name"
                    @change="onSortChange($event)" />
                <!-- <IconField iconPosition="left">
                        <InputIcon class="pi pi-search"></InputIcon>
                        <InputText placeholder="Keyword Search" />
                    </IconField> -->
                <!-- </div> -->
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                    <template #option="{ option }">
                        <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                    </template>
                </SelectButton>
                <Button label="Add Project" icon="pi pi-plus" @click="addProject" class="p-button-success"
                    :disabled="!authStore.isAdmin" getMissingPermissionString
                    v-tooltip.top="authStore.isAdmin ? '' : getMissingPermissionString()" />
                <!-- </div> -->
            </div>
        </template>
        <template #empty>
            <Message severity="warn" :closable="false">Currently, there are no projects available.</Message>
        </template>
        <template #list="slotProps">
            <ScrollableCardList :items="slotProps.items" layout="list" :loading="props.loading" :onEdit="props.onEdit"
                :onDelete="props.onDelete" :navigateToProject="navigateToProject" />
        </template>
        <template #grid="slotProps">
            <ScrollableCardList :items="slotProps.items" layout="grid" :loading="props.loading" :onEdit="props.onEdit"
                :onDelete="props.onDelete" :navigateToProject="navigateToProject" />
        </template>
    </DataView>
</template>

<script setup lang="ts">
import type { ProjectResponse } from '@/composables/queries/project-query';
import ScrollableCardList from './ScrollableCardList.vue';
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Select from 'primevue/select';
import { useAuthStore } from '@/stores/auth';
import { getMissingPermissionString } from '@/lib/permissions';
const authStore = useAuthStore()


const props = defineProps({
    data: {
        type: Array as () => ProjectResponse //  as () => any, // DataViewProps
    },
    onEdit: Function as PropType<(id: number) => void>,
    onDelete: Function as PropType<(id: number, name: string) => void>,
    loading: Boolean,
});

const router = useRouter();

const navigateToProject = (projectId: number) => {
    router.push(`/projects/${projectId}`);
};

const addProject = () => {
    router.push('/projects/add');
};

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Name ascending', value: '!name' },
    { label: 'Name descending', value: 'name' },
]);

const onSortChange = (event: any) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

const layout = ref<'grid' | 'list'>('grid');
const options = ref(['list', 'grid']);

</script>

<style scoped>
.flex {
    display: flex;
}

.justify-content-between {
    justify-content: space-between;
}

.align-items-center {
    align-items: center;
}

.confirm-button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>