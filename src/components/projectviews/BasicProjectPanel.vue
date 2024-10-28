<template>
    <Panel class="grid-item" :header="panel_header">
        <div>{{ panel_description }}</div>
        <div class="flex gap-4 mt-4">
            <div style="flex:2">
                <FloatLabel variant="on">
                    <InputText id="name" v-model="project.name" class="w-full" :invalid="submitted && !project.name" />
                    <label for="name">Name</label>
                </FloatLabel>
                <small class="p-error" v-if="submitted && !project.name">Name is required.</small>
            </div>
            <div style="flex:1">
                <FloatLabel variant="on">
                    <InputText id="version" v-model="project.version" class="w-full"
                        :invalid="submitted && !project.version" />
                    <label for="version">Version</label>
                </FloatLabel variant="on">
                <small class="p-error" v-if="submitted && !project.version">Version is required.</small>
            </div>
        </div>
        <div>
            <FloatLabel class="mt-5" variant="on">
                <Textarea id="description" v-model="project.description" rows="5" class="w-full"
                    :invalid="submitted && !project.description" />
                <label for="description">Description</label>
            </FloatLabel>
            <small class="p-error" v-if="submitted && !project.description">Description is required.</small>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';


const props = defineProps({
    project: {
        type: Object as PropType<{ name: string, version: string, description: string, equivalence_required: boolean, status_required: boolean }>,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    },
    header: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

const panel_header = ref("Add project");
if (props.header) {
    panel_header.value = props.header
}

const panel_description = ref("Create a new Mapping Project.")
if (props.description) {
    panel_description.value = props.description
}

</script>
