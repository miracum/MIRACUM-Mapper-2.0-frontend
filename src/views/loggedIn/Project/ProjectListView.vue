<template>
    <DataView :value="props.data" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" :dataKey="'id'"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}">
        <template #header>
            <div class="flex justify-content-between align-items-center">
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort by Name"
                    @change="onSortChange($event)" />
                <DataViewLayoutOptions v-model="layout" />
            </div>
        </template>
        <template #list="slotProps">
            <div v-for="(project, index) in slotProps.items" :key="project.id" class="card-spacing"
                style="margin-bottom: 1rem;">
                <Card>
                    <template #title>{{ project.name }}</template>
                    <template #subtitle>{{ project.version }}</template>
                    <template #content>
                        <div class="card-content">
                            <p class="m-0">{{ project.description }}</p>
                            <div class="card-actions">
                                <Button label="Edit" icon="pi pi-pencil"
                                    @click="props.onEdit && props.onEdit(project.id)" outlined></Button>
                                <Button label="Delete" icon="pi pi-trash"
                                    @click="props.onDelete && props.onDelete(project.id, project.name)"
                                    severity="danger" outlined></Button>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </template>

        <template #grid="slotProps">
            <div class="grid grid-nogutter">
                <div v-for="(project, index) in slotProps.items" :key="project.id" class="card-spacing"
                    style="margin-bottom: 1rem;">
                    <Card>
                        <template #title>{{ project.name }}</template>
                        <template #subtitle>{{ project.version }}</template>
                        <template #content>
                            <div class="card-content">
                                <p class="m-0">{{ project.description }}</p>
                                <div class="card-actions">
                                    <Button label="Edit" icon="pi pi-pencil"
                                        @click="props.onEdit && props.onEdit(project.id)" outlined></Button>
                                    <Button label="Delete" icon="pi pi-trash"
                                        @click="props.onDelete && props.onDelete(project.id, project.name)"
                                        severity="danger" outlined></Button>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import type { ProjectResponse } from '@/composables/queries/project-query';
import type { PropType } from 'vue';
import { defineProps, ref } from 'vue';

const props = defineProps({
    data: {
        type: Array as () => ProjectResponse //  as () => any, // DataViewProps
    },
    onEdit: Function as PropType<(id: number) => void>,
    onDelete: Function as PropType<(id: number, name: string) => void>,
});

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
</style>