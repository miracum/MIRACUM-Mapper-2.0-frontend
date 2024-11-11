<template>
    <Select :options="props.users" filter optionLabel="fullname" :filterFields="['fullname', 'username', 'email']"
        placeholder="Select a User">
        <template #value="slotProps">
            <div v-if="slotProps.value.id" class="flex items-center">
                <Avatar :label="getLabel(slotProps.value)" :icon="getIcon(slotProps.value)" class="mr-2" size="large"
                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <div>
                    <div v-if="slotProps.value.fullname" style="font-weight: bold;">{{ slotProps.value.fullname }}</div>
                    <div v-else style="font-weight: bold;">{{ slotProps.value.username }}</div>
                    <div v-if="slotProps.value.email">{{ slotProps.value.email }}</div>
                </div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="slotProps">
            <div class="flex items-center">
                <Avatar :label="getLabel(slotProps.option)" :icon="getIcon(slotProps.option)" class="mr-2" size="large"
                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <div>
                    <div v-if="slotProps.option.fullname" style="font-weight: bold;">{{ slotProps.option.fullname }}
                    </div>
                    <div v-else style="font-weight: bold;">{{ slotProps.option.username }}</div>
                    <div v-if="slotProps.option.email">{{ slotProps.option.email }}</div>
                </div>
            </div>
        </template>
    </Select>
</template>


<script setup lang="ts">
import Select from 'primevue/select';

const props = defineProps({
    users: {
        type: Array,
        required: true
    },
});

const getLabel = (user: any) => {
    const { fullname, username } = user;
    if (fullname && fullname.length > 0) {
        return fullname[0];
    } else if (username && username.length > 0) {
        return username[0];
    } else {
        return undefined;
    }
};

const getIcon = (user: any) => {
    const { fullname, username } = user;
    if ((!fullname || fullname.length == '') && (!username || username.length == '')) {
        return 'pi pi-user';
    } else {
        return undefined;
    }
};

</script>