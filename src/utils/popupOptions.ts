
import type { Ref } from 'vue';
import type { AppError } from "@/composables/queries/query";
import type { ToastMessageOptions } from "primevue/toast";
import type { ConfirmationOptions } from "primevue/confirmationoptions";

export function getDeleteConfirmationOptions(typeName: string, name: string, accept: () => void) {
    return <ConfirmationOptions>{
        message: `Are you sure you want to delete the ${typeName} ${name}?`,
        header: `Delete ${typeName}`,
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: accept,
    }
}

export function getDeleteToastOptions(error: Ref<AppError | undefined>, typeName: string, name: string, life: number = 10000) {
    return getToastOptions('delete', 'deleted', error, typeName, name, life);
}

export function getCreateToastOptions(error: Ref<AppError | undefined>, typeName: string, name: string, life: number = 10000) {
    return getToastOptions('create', 'created', error, typeName, name, life);
}

export function getUpdateToastOptions(error: Ref<AppError | undefined>, typeName: string, name: string, life: number = 10000) {
    return getToastOptions('update', 'updated', error, typeName, name, life);
}

export function getToastOptions(keyword: string, keywordPast: string, error: Ref<AppError | undefined>, typeName: string, name: string, life: number = 10000) {
    if (!error.value) {
        return <ToastMessageOptions>{severity: 'success', summary: 'Success', detail: `${typeName} ${name} ${keywordPast} successfully`, life: life};
    } else {
        // TODO this is a bad error message. Define error codes in the backend and translate them to meaningful ui errors. E.g. if the user isnt in the right scope, provide a unsufficient user permissions error instead of the current api error
        return <ToastMessageOptions>{severity: 'error', summary: 'Error', detail: `Could not ${keyword} ${typeName} ${name}: ${error.value?.message ? JSON.stringify(error.value.message) : 'Unknown error'}`, life: life};
    }
}
