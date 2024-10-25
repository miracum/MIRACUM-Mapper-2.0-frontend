<template>
    <!-- v-model="localMappingValue[props.field + '_' + props.roleId]"  -->
    <Select :options="props.users" filter optionLabel="fullname" :filterFields="['fullname', 'username', 'email']"
        placeholder="Select a User">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
                <Avatar v-if="slotProps.value.fullname" :label="slotProps.value.fullname[0]" class="mr-2" size="large"
                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <Avatar v-else icon="pi pi-user" class="mr-2" size="large"
                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <div>
                    <div v-if="slotProps.value.fullname" style="font-weight: bold;">{{ slotProps.value.fullname }}</div>
                    <div v-else style="font-weight: bold;">{{ slotProps.value.username }}</div>
                    <!-- <div>{{ slotProps.value.description }}</div> -->
                    <div v-if="slotProps.value.email">{{ slotProps.value.email }}</div>
                </div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="slotProps">
            <div class="flex items-center">
                <Avatar :label="slotProps.option.fullname[0]" class="mr-2" size="large"
                    style="background-color: #ece9fc; color: #2a1261" shape="circle" />
                <div>
                    <div v-if="slotProps.option.fullname" style="font-weight: bold;">{{ slotProps.option.fullname }}
                    </div>
                    <div v-else style="font-weight: bold;">{{ slotProps.option.username }}</div>
                    <div v-if="slotProps.option.email">{{ slotProps.option.email }}</div>
                </div>
            </div>
        </template>
        <!-- <template #optiongroup="slotProps">
            <div>{{ slotProps.option.name }}</div>
        </template> -->
    </Select>
</template>


<script setup lang="ts">
import Select from 'primevue/select';
import { ref } from 'vue';

// input of the component
const props = defineProps({
    users: {
        type: Array,
        required: true
    },
});


</script>