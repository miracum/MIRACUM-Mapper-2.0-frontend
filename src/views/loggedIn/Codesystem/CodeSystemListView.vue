<template>
    <DataView :value="props.data" :layout="layout" :sortOrder="sortOrder" :sortField="sortField" :dataKey="'id'"
        paginator :rows="20" :rowsPerPageOptions="[10, 20, 50, 100]"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        scrollable scroll-height="calc(100vh - 430px)">
        <template #header>
            <div class="flex justify-content-between align-items-center">
                <Select v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort by Name"
                    @change="onSortChange($event)" />
                <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                    <template #option="{ option }">
                        <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
                    </template>
                </SelectButton>
                <Button label="Add Codesystem" icon="pi pi-plus" @click="addCodeSystem" class="p-button-success" />
            </div>
        </template>
        <template #empty>
            <Message severity="warn" :closable="false">Currently, there are no codesystems available.</Message>
        </template>
        <template #list="slotProps">
            <CodeSystemCardList :items="slotProps.items" layout="list" :loading="props.loading" />
        </template>
        <template #grid="slotProps">
            <CodeSystemCardList :items="slotProps.items" layout="grid" :loading="props.loading" />
        </template>
    </DataView>
</template>

<script setup lang="ts">
import Select from 'primevue/select';
import CodeSystemCardList from './CodeSystemCardList.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { GetCodeSystem } from '@/stores/codesystem';

const props = defineProps({
    data: {
        type: Array<GetCodeSystem>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    }
});

const router = useRouter();

const addCodeSystem = () => {
    router.push('/codesystems/add');
};

const layout = ref<'grid' | 'list'>('grid');
const options = ref(['list', 'grid']);

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

</script>