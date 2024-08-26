<template>
    <!-- <Panel>
        <template #header>
            <div class="header">
                <h1 class="title">Add Project</h1>
            </div>
        </template>
<h2 class="subtitle">Create a new Mapping Project</h2>
</Panel> -->
    <Panel header="Add Project">
        Create a new Mapping Project
    </Panel>

    <Panel header="General Information" class="panel">
        <div class="flex-row">
            <FloatLabel class="flex-item flex-item-name">
                <InputText id="name" v-model="project.name" />
                <label for="name">Name</label>
            </FloatLabel>
            <FloatLabel class="flex-item flex-item-version">
                <InputText id="version" v-model="project.version" />
                <label for="version">Version</label>
            </FloatLabel>
        </div>
        <FloatLabel class="full-width">
            <Textarea id="description" v-model="project.description" rows="5" cols="44" />
            <label for="description">Description</label>
        </FloatLabel>
    </Panel>
    <Panel header="Permissions" class="panel">
        <DataTable :value="userPermissions" tableStyle="min-width: 30rem" @rowReorder="onUserPermissionsRowReorder">
            <Column rowReorder headerStyle="width: 3rem" />
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
                    <UserPermissionSelect v-model="slotProps.data.role" />
                </template>
            </Column>
            <Column style="width: auto; margin: 0; padding: 0%">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" text rounded severity="danger"
                        @click="onUserPermissionDelete(slotProps.index)" />
                </template>
            </Column>
        </DataTable>
    </Panel>
    <Panel header="Code System Roles" class="panel">
        <DataTable :value="codeSystemRoles" tableStyle="min-width: 30rem" @rowReorder="onCodeSystemRowReorder">
            <Column rowReorder headerStyle="width: 3rem" />
            <Column header="CodeSystem">
                <template #body="slotProps">
                    <!-- <RoleSelect v-model="slotProps.data.role" /> -->
                    <CodeSystemNameAutoComplete v-model="slotProps.data.codeSystem" />
                </template>
            </Column>

            <Column header="Role">
                <template #body="slotProps">
                    <RoleSelect v-model="slotProps.data.role" />
                </template>
            </Column>
            <Column header="Name">
                <template #body="slotProps">
                    <InputText v-model=slotProps.data.name placeholder="Name" />
                </template>
            </Column>
            <Column style="width: auto; margin: 0; padding: 0%">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" text rounded severity="danger"
                        @click="onCodeSystemDelete(slotProps.index)" />
                </template>
            </Column>
        </DataTable>
    </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userPermissions = ref([
    {
        user: {
            name: 'John Doe',
            email: 'john.doe@fau.de',
            id: 1
        },
        role: 'reviewer'
    },
    {
        user: {
            name: 'Jane Doe',
            email: 'jane.doe@fau.de',
            id: 2
        },
        role: 'project_owner'
    }
]);

const onUserPermissionsRowReorder = (event) => {
    userPermissions.value = event.value;
};

const onUserPermissionDelete = (index) => {
    userPermissions.value.splice(index, 1);
};

const codeSystemRoles = ref([
    {
        codeSystem: {
            name: 'SNOMED CT',
            version: '1.2.5',
            id: 1
        },
        role: 'source',
        name: 'SNOMED CT'
    },
    {
        codeSystem: 'LOINC',
        role: 'target',
        name: 'LOINC'
    }

]);

const onCodeSystemRowReorder = (event) => {
    codeSystemRoles.value = event.value;
};

const onCodeSystemDelete = (index) => {
    codeSystemRoles.value.splice(index, 1);
};


const project = ref({
    name: '',
    version: '',
    description: ''
});
</script>

<style>
.title {
    font-size: 24px;
    margin: 0;
}

.subtitle {
    font-size: 18px;
    color: #666;
    margin: 0;
}

.panel {
    display: inline-block;
}

.flex-row {
    display: flex;
    flex-wrap: wrap;
}

.flex-item {
    flex: 1;
    margin-right: 10px;
}

.flex-item:last-child {
    margin-right: 0;
}

.full-width {
    width: 100%;
    margin-top: 10px;
}
</style>