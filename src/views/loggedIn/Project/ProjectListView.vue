<template>
    <DataView :value="props.data" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" :dataKey="'id'"
        paginator :rows="4" :rowsPerPageOptions="[4, 10, 20, 50]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}">
        <template #header>
            <div class="flex justify-content-between align-items-center">
                <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort by Name"
                    @change="onSortChange($event)" />
                <!-- <DataViewLayoutOptions v-model="layout" /> -->
                <Button label="Add Project" icon="pi pi-plus" @click="addProject" class="p-button-success" />
            </div>
        </template>
        <template #list="slotProps">
            <div v-for="(project, index) in slotProps.items" :key="project.id" class="card-spacing"
                style="margin-bottom: 1rem;">
                <Card @click="navigateToProject(project.id)" class="card">
                    <template #title>{{ project.name }}</template>
                    <template #subtitle>{{ project.version }}</template>
                    <template #content>
                        <div class="card-content">
                            <p class="m-0">{{ project.description }}</p>
                            <div class="card-actions">
                                <Button label="Edit" icon="pi pi-pencil"
                                    @click.stop="props.onEdit && props.onEdit(project.id)" outlined></Button>
                                <Button label="Delete" icon="pi pi-trash"
                                    @click.stop="props.onDelete && props.onDelete(project.id, project.name)"
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

const layout = ref<'grid' | 'list'>('list');

</script>

<style scoped>
.card {
    background-color: #eff0f1;
    /* Blue Grey background color */
}

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