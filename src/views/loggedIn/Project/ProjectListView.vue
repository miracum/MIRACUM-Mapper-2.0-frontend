<template>
    <DataView :value="props.data" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" :dataKey="'id'"
        paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" scrollable scroll-height="calc(100vh - 430px)">
        <template #header>
            <div class="flex justify-content-between align-items-center">
                <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort by Name"
                    @change="onSortChange($event)" />
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                    <template #option="{ option }">
                        <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                    </template>
                </SelectButton>
                <Button label="Add Project" icon="pi pi-plus" @click="addProject" class="p-button-success" />
            </div>
        </template>
        <template #list="slotProps">
            <ScrollableCardList :items="slotProps.items" layout="list" :onEdit="props.onEdit" :onDelete="props.onDelete"
                :navigateToProject="navigateToProject" />
        </template>
        <template #grid="slotProps">
            <ScrollableCardList :items="slotProps.items" layout="grid" :onEdit="props.onEdit" :onDelete="props.onDelete"
                :navigateToProject="navigateToProject" />
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

const props = defineProps({
    data: {
        type: Array as () => ProjectResponse //  as () => any, // DataViewProps
    },
    onEdit: Function as PropType<(id: number) => void>,
    onDelete: Function as PropType<(id: number, name: string) => void>,
});

const router = useRouter();

const navigateToProject = (projectId: number) => {
    // console.log('Navigating to project', projectId);
    router.push(`/dashboard/projects/${projectId}/mappings`);
};

const addProject = () => {
    router.push('/dashboard/projects/add');
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