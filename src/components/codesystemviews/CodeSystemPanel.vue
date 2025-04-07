<template>
    <Panel class="grid-item" :header="panel_header">
        <div>{{ panel_description }}</div>
        <div class="flex gap-4 mt-4">
            <div style="flex:2">
                <FloatLabel variant="on">
                    <InputText id="name" v-model="codesystem.name" class="w-full" :invalid="submitted && !codesystem.name" />
                    <label for="name">Name *</label>
                </FloatLabel>
                <small class="p-error" v-if="submitted && !codesystem.name">Name is required.</small>
            </div>
            <div style="flex:1">
                <CodeSystemTypeSelect class="type-select" v-model="codesystem.type" :invalid="submitted && !codesystem.type" />
                <small class="p-error" v-if="submitted && !codesystem.type">Type is required.</small>
            </div>
        </div>
        <div class="mt-4">
            <FloatLabel variant="on">
                <InputText id="uri" v-model="codesystem.uri" class="w-full" :invalid="submitted && !codesystem.uri" />
                <label for="uri">URI *</label>
            </FloatLabel>
            <small class="p-error" v-if="submitted && !codesystem.uri">URI is required.</small>
        </div>
        <div class="flex gap-4 mt-4">
            <div style="flex:1">
                <FloatLabel variant="on">
                    <InputText id="title" v-model="codesystem.title" class="w-full" />
                    <label for="title">Title</label>
                </FloatLabel>
            </div>
            <div style="flex:1">
                <FloatLabel variant="on">
                    <InputText id="author" v-model="codesystem.author" class="w-full" />
                    <label for="author">Author</label>
                </FloatLabel>
            </div>
        </div>
        <div class="mt-4">
            <FloatLabel variant="on">
                <Textarea id="description" v-model="codesystem.description" rows="5" class="w-full" />
                <label for="description">Description</label>
            </FloatLabel>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CreateCodeSystem, GetCodeSystem } from '@/stores/codesystem';
import CodeSystemTypeSelect from '@/components/selects/CodeSystemTypeSelect.vue';


const props = defineProps({
    codesystem: {
        type: Object as () => GetCodeSystem | CreateCodeSystem,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    },
    edit: {
        type: Boolean,
        required: false
    },
});

const panel_header = props.edit ? ref("Edit codesystem") : ref("Add codesystem");
const panel_description = props.edit ? ref("Edit an existing codesystem.") : ref("Create a new codesystem.")

</script>

<style scoped>
.grid-item {
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
}

.p-error {
    display: block;
}

.type-select {
    width: 100%;
}
</style>
