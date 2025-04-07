<template>
    <Panel class="grid-item" header="Import Version">
        <div class="mb-3">
            There is already an import in progress at the moment. Please wait until the import is finished. You will be automatically redirected to the import page once the import is finished.
        </div>
        <div>
            Progress:
            <ProgressBar class="mt-2" :value="props.status.progress" />
        </div>
    </Panel>
</template>

<script setup lang="ts">
import type { ImportStatus } from '@/stores/codesystem';


const props = defineProps({
    status: {
        type: Object as () => ImportStatus,
        required: true
    },
});

</script>

<style scoped>
.grid-item {
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
}
</style>
