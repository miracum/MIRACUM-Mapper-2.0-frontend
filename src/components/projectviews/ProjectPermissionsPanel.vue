<template>
    <Panel class="grid-item" header="Permissions">
        <Button label="Add Permission" icon="pi pi-plus" severity="success" class="mr-2 mt-3" @click="addPermission" />
        <DataTable :value="userPermissions" tableStyle="min-width: 30rem" scrollable scroll-height="500px">
            <!--@rowReorder="onUserPermissionsRowReorder"-->
            <!-- <Column rowReorder headerStyle="width: 3rem" /> -->
            <Column header="User">
                <template #body="slotProps">
                    <div class="inline-flex align-items-center gap-1 px-2 py-2">
                        <Avatar icon="pi pi-user" class="mr-2" size="large"
                            style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                        <span class="inline-flex flex-col items-start">
                            <span class="font-bold">{{ slotProps.data.user.name }}</span>
                            <span class="text-sm">{{ slotProps.data.user.email }}</span>
                        </span>
                    </div>
                </template>
            </Column>
            <Column header="Permission">
                <template #body="slotProps">
                    <div>
                        <UserPermissionSelect v-model="slotProps.data.role"
                            :invalid="submitted && !slotProps.data.role" />
                        <small class="p-error" v-if="submitted && !slotProps.data.role">Role is required.</small>
                    </div>
                </template>
            </Column>
            <Column style="width: auto; margin: 0; padding: 0%" v-if="userPermissions.length > 1">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" text rounded severity="danger"
                        @click="onUserPermissionDelete(slotProps.index)" />
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<script setup lang="ts">
import { type Prop, type PropType } from 'vue';


const props = defineProps({
    project: {
        type: Object as PropType<{ name: string, version: string, description: string, equivalence_required: boolean, status_required: boolean }>,
        required: true
    },
    userPermissions: {
        type: Array as PropType<Array<{ user: { name: string; email: string; id: string }; role?: string }>>,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    }
});

// const emit = defineEmits(['update:userPermissions']);


// const onUserPermissionsRowReorder = (event) => {
//     emit('update:userPermissions', event.value);
// };

const onUserPermissionDelete = (index: number) => {
    props.userPermissions.splice(index, 1);
};

const addPermission = () => {
    props.userPermissions.push({
        user: {
            name: 'John Doe',
            email: 'john.doe@fau.de',
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
        },
        role: ''
    });
};

</script>