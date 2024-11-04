<template>
    <Card @click="navigateToProject(project.id)" class="card p-0 h-48 flex flex-col">
        <template #title>
            <p class="m-0 truncate">{{ project.name }}</p>
        </template>
        <template #subtitle>
            <div class="card-content">
                <Tag :value="props.project.version" severity="contrast" class="m-0 truncate" />
                <div v-if="authStore.isAdmin" class="card-actions">
                    <Button label="Edit" icon="pi pi-pencil"
                        @click.stop="props.onEdit && props.onEdit(props.project.id)" outlined></Button>
                    <Button label="Delete" icon="pi pi-trash"
                        @click.stop="props.onDelete && props.onDelete(props.project.id, props.project.name)"
                        severity="danger" outlined></Button>
                </div>
            </div>
        </template>
        <template #content>
            <p class="m-0 truncate-3-lines">{{ project.description }}</p>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

const props = defineProps({
    project: {
        type: Object,
        required: true
    },
    onEdit: {
        type: Function,
        required: true
    },
    onDelete: {
        type: Function,
        required: true
    },
    navigateToProject: {
        type: Function,
        required: true
    }
});
</script>

<style scoped>
.card {
    background-color: #eff0f1;
    /* Blue Grey background color */
    margin-bottom: 0;
}

.truncate-3-lines {
    display: -webkit-box;
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