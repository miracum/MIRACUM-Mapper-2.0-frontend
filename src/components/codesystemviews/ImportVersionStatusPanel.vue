<template>
    <Panel class="grid-item" header="Import Status">
        <div v-if="props.status === null">
            Please start the import first.
        </div>
        <div v-else>
            <div>
                Status: <strong>{{ props.status!.running ? "Running" : "Finished" }}</strong>
                <br />
                Errors: <strong>{{ props.status!.error === null ? "No errors so far" : props.status!.error }}</strong>
                <br />
                Progress:
                <ProgressBar class="mt-2" :value="props.status!.progress" />
            </div>
        </div>
    </Panel>
</template>

<script setup lang="ts">
import type { ImportStatus } from '@/stores/codesystem';

const props = defineProps({
    status: {
        type: Object as () => ImportStatus | null,
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
