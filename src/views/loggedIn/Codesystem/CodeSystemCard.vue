<template>
    <template v-if="loading">
        <Card class="card p-0 h-48 flex flex-col">
            <template #title>
                <Skeleton width="12rem" height="2rem" />
            </template>
            <template #subtitle>
                <Skeleton width="8rem" height="1rem" />
            </template>
            <template #content>
                <div class="card-content">
                    <Skeleton width="60%" height="1rem"></Skeleton>
                    <div class="card-actions-no-hover">
                        <Skeleton width="4rem" height="2rem" />
                        <Skeleton width="4rem" height="2rem" />
                    </div>
                </div>
            </template>
        </Card>
    </template>
    <template v-else>
        <Card @click="onClick(props.codesystem.id)" class="card p-0 h-48 flex flex-col">
            <template #title>
                <p class="m-0 truncate">{{ props.codesystem.name }}</p>
            </template>
            <template #subtitle>
                <div class="card-content">
                    <Tag :value="props.codesystem.type" severity="contrast" class="m-0 truncate" />
                    <div class="card-actions">
                        <Button label="Edit" icon="pi pi-pencil"
                            @click.stop="onEdit(props.codesystem.id)" outlined></Button>
                        <Button label="Delete" icon="pi pi-trash"
                            @click.stop="onDelete(props.codesystem.id, props.codesystem.name)"
                            severity="danger" outlined></Button>
                    </div>
                </div>
            </template>
            <template v-if="props.codesystem.description" #content>
                <p class="m-0 truncate-3-lines">{{ props.codesystem.description }}</p>
            </template>
        </Card>
    </template>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { GetCodeSystem } from '@/stores/codesystem';
import { useCodeSystemStore } from '@/stores/codesystem';
import { getDeleteConfirmationOptions, getDeleteToastOptions } from "@/utils/popupOptions";

const store = useCodeSystemStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
    codesystem: {
        type: Object as () => GetCodeSystem,
        required: true
    },
    loading: {
        type: Boolean,
        required: true
    }
});

const onClick = (codeSystemId: number) => {
    router.push(`/codesystems/${codeSystemId}`);
};

const onDelete = (id: number, name: string) => {
    const typeName = 'Codesystem';
    confirm.require(getDeleteConfirmationOptions(typeName, name, () => {
        const { isFetching, error } = store.deleteCodeSystem(id);
        watch(isFetching, (newVal) => {
            if (!newVal) {
                toast.add(getDeleteToastOptions(error, typeName, name));
            }
        });
    }));
};

const onEdit = (id: number) => {
    router.push(`/codesystems/${id}/edit`);
};

</script>

<style scoped>
.card {
    background-color: #eff0f1;
    margin-bottom: 0;
}

.truncate-3-lines {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-actions-no-hover {
    display: flex;
    gap: 10px;
}

.card-actions {
    display: flex;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card:hover .card-actions {
    opacity: 1;
}
</style>