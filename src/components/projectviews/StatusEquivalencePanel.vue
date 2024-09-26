<template>
    <Panel class="grid-item" header="Specification">
        <div>This cannot be changed later.</div>
        <div class="flex flex-col">
            <div class="flex mt-3">
                <Checkbox v-model="project.equivalence_required" :binary="true" :disabled="disabled" />
                <label class="ml-2">Enable to select the equivalence of a mapping</label>
            </div>
            <div class="flex mt-3">
                <Checkbox v-model="project.status_required" :binary="true" :disabled="disabled" />
                <label class="ml-2">Enable to select the status of a mapping</label>
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import Checkbox from 'primevue/checkbox';

const props = defineProps({
    project: {
        type: Object as PropType<{ name: string, version: string, description: string, equivalence_required: boolean, status_required: boolean }>,
        required: true
    },
    submitted: {
        type: Boolean,
        required: true
    },
    isDisabled: {
        type: Boolean,
        required: false
    }
});


const disabled = ref(false)
if (props.isDisabled) {
    disabled.value = props.isDisabled;
}

</script>