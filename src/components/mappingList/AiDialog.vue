<template>
    <Dialog v-model:visible="localVisible" modal :style="{ width: '900px' }" :header="props.header" class="p-fluid"
        @hide="handleXButton">
        <h4>
            <i class="pi pi-sparkles" style="margin-bottom: 20px; margin-right: 8px;"></i>AI Predictions
            <span v-if="isLoading" style="margin-left: 10px; font-size: 0.9em; color: #6b7273; font-weight: normal;">
                <i class="pi pi-spinner pi-spin" style="margin-right: 5px;"></i>Loading...
            </span>
        </h4>

        <!-- Loading State -->
        <div v-if="isLoading" style="text-align: center; padding: 20px;">
            <!-- <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i> -->
            <div style="max-height: 300px; overflow-y: auto;">
                <Card v-for="n in 3" :key="n" style="margin-left: 5px; margin-right: 5px; margin-bottom: 10px; border: 1px solid #E5E6EE;">
                    <template #content>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <Skeleton width="40%" height="1.2rem" class="mb-2"></Skeleton>
                                <Skeleton width="75%" height="1rem"></Skeleton>
                            </div>
                            <Skeleton width="4rem" height="1.5rem" class="ml-3"></Skeleton>
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <!-- Error State -->
        <div v-if="error" style="text-align: center; padding: 20px;">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem;"></i>
            <p style="margin-top: 10px;">{{ error }}</p>
            <Button label="Retry" icon="pi pi-refresh" @click="fetchPredictions" style="margin-top: 10px;" />
        </div>

        <!-- Predictions Display -->
        <div v-if="predictions && predictions.length > 0" class="field-container" style="margin-bottom: 20px;">
            <div style="max-height: 300px; overflow-y: auto;">
                <Card v-for="(prediction, index) in predictions" :key="index" 
                      style="margin-left: 5px; margin-right: 5px; margin-bottom: 10px; cursor: pointer; border: 1px solid #E5E6EE;"
                      @click="selectPrediction(prediction)">
                    <template #content>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>{{ prediction.code }}</strong> - {{ prediction.meaning }}
                            </div>
                            <Tag :value="getConfidenceLabel(prediction.score)" :severity="getConfidenceSeverity(prediction.score)" />
                        </div>
                    </template>
                </Card>
            </div>
        </div>

        <div v-if="source">
            <CodeSystemRole :role="source" />
            <div class="field-container" style="display:flex;">
                <div class="field col" style="flex: 1;">
                    <FloatLabel variant="on" style="margin-top: 15px;">
                        <ConceptAutoComplete disabled v-model="currentMapping['code_' + source.id]" :roleId="source.id"
                            field="code" :inputStyle="{ width: '100%' }"
                            @item-select="(event: any) => source && on_item_select_autocomplete(event.value, currentMapping, source.id)"
                            @blur="source && validateFields(currentMapping, source.id)" />
                        <label :for="`code_${source.id}`">Code</label>
                    </FloatLabel>
                </div>
                <div class="field col" style="flex: 1;">
                    <FloatLabel variant="on" style="margin-top: 15px;">
                        <ConceptAutoComplete disabled v-model="currentMapping['meaning_' + source.id]" :roleId="source.id"
                            field="meaning" :inputStyle="{ width: '100%' }"
                            @item-select="(event: any) => source && on_item_select_autocomplete(event.value, currentMapping, source.id)"
                            @blur="source && validateFields(currentMapping, source.id)" />
                        <label :for="`meaning_${source.id}`">Meaning</label>
                    </FloatLabel>
                </div>
            </div>
        </div>

        <div v-if="target" style="margin-top: 20px;">
            <CodeSystemRole :role="target" />
            <div class="field-container" style="display:flex;">
                <div class="field col" style="flex: 1;">
                    <FloatLabel variant="on" style="margin-top: 15px;">
                        <ConceptAutoComplete v-model="currentMapping['code_' + target.id]" :roleId="target.id"
                            field="code" :inputStyle="{ width: '100%' }"
                            @item-select="(event: any) => target && on_item_select_autocomplete(event.value, currentMapping, target.id)"
                            @blur="target && validateFields(currentMapping, target.id)" />
                        <label :for="`code_${target.id}`">Code</label>
                    </FloatLabel>
                </div>
                <div class="field col" style="flex: 1;">
                    <FloatLabel variant="on" style="margin-top: 15px;">
                        <ConceptAutoComplete v-model="currentMapping['meaning_' + target.id]" :roleId="target.id"
                            field="meaning" :inputStyle="{ width: '100%' }"
                            @item-select="(event: any) => target && on_item_select_autocomplete(event.value, currentMapping, target.id)"
                            @blur="target && validateFields(currentMapping, target.id)" />
                        <label :for="`meaning_${target.id}`">Meaning</label>
                    </FloatLabel>
                </div>
            </div>
        </div>

        <div class="field-container" style="display: flex; gap: 10px; margin-top: 10px;"
            v-if="projectStore.currentProjectDetails">

            <div class="field col flex-column" style="flex: 1;"
                v-if="projectStore.currentProjectDetails.status_required">
                <div class="flex flex-col">
                    <label for="status" class="mb-3">Status</label>
                    <StatusSelect v-model="currentMapping.status" :required="true"
                        :invalid="submitted && !currentMapping.status" placeholder="Select a Status" />
                    <small class="p-error" v-if="submitted && !currentMapping.status">Status is required.</small>
                </div>
            </div>

            <div class="field col flex-column" style="flex: 1;"
                v-if="projectStore.currentProjectDetails.equivalence_required">
                <div class="flex flex-col">
                    <label for="equivalence" class="mb-3">Equivalence</label>
                    <EquivalenceSelect v-model="currentMapping.equivalence" :required="true"
                        :invalid="submitted && !currentMapping.equivalence" placeholder="Select the equivalence" />
                    <small class="p-error" v-if="submitted && !currentMapping.equivalence">Equivalence is
                        required.</small>
                </div>
            </div>
        </div>

        <div class="field col flex-column">
            <FloatLabel variant="on">
                <InputText id="comment" v-model="currentMapping.comment" required="false" style="width: 100%" />
                <label for="comment">Comment</label>
            </FloatLabel>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
            <Button label="Save" icon="pi pi-check" text @click="submitMapping" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, type PropType } from 'vue';
import { useProjectStore } from '@/stores/project';
import { on_item_select_autocomplete, validateFields } from '@/utils/autocomplete';
import { useGetConceptsQuery } from '@/composables/queries/mapping-query';

// Define interfaces for type safety
interface Prediction {
    code: string;
    meaning: string;
    score: number;
}

interface PredictionResponse {
    task_id: string;
}

interface StatusResponse {
    status: 'pending' | 'completed' | 'failed';
    predictions?: Prediction[];
    error?: string;
}

// input of the component
const props = defineProps({
    header: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        required: true
    },
    mapping: {
        type: Object as PropType<Record<string, any>>,
        required: false
    },
    saveMapping: {
        type: Function as PropType<(mapping: any) => void>,
        required: true
    }
});

const projectStore = useProjectStore();
const source = projectStore.currentProjectDetails?.code_system_roles[0];
const target = projectStore.currentProjectDetails?.code_system_roles[1];

// AI prediction state
const isLoading = ref(false);
const error = ref<string | null>(null);
const predictions = ref<Prediction[]>([]);
const statusInterval = ref<number | null>(null);

// handle visibility of the dialog
const emit = defineEmits(['update:visible']);
const localVisible = ref(props.visible);
watch(() => props.visible, (newVal) => {
    localVisible.value = newVal;
    if (newVal) {
        fetchPredictions();
    }
});
watch(localVisible, (newVal) => {
    emit('update:visible', newVal);
});

function closeDialog() {
    localVisible.value = false;
    resetForm();
    clearStatusInterval();
}

function handleXButton() {
    resetForm();
    clearStatusInterval();
}

function resetForm() {
    submitted.value = false;
    currentMapping.value = {
        equivalence: null,
        status: null,
    };
    isLoading.value = false;
    error.value = null;
    predictions.value = [];
}

const currentMapping = ref<Record<string, any>>({
    equivalence: null,
    status: null,
});

if (props.mapping) {
    currentMapping.value = { ...props.mapping };
}

watch(() => props.mapping, (newVal) => {
    if (newVal) {
        currentMapping.value = { ...newVal };
    }
});

const submitted = ref(false);

// AI prediction
async function fetchPredictions() {
    isLoading.value = true;
    error.value = null;
    predictions.value = [];

    try {
        const sourceCode = source ? currentMapping.value[`code_${source.id}`] : '';
        const sourceMeaning = source ? currentMapping.value[`meaning_${source.id}`] : '';

        const requestBody = {
            description: sourceMeaning || sourceCode || 'TEST',
            source_code: sourceCode,
            source_meaning: sourceMeaning
        };

        const response = await fetch('http://localhost:8000/api/v1/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to start prediction');
        }

        const data: PredictionResponse = await response.json();
        pollStatus(data.task_id);

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred';
        isLoading.value = false;
    }
}

function pollStatus(taskId: string) {
    statusInterval.value = setInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/status/${taskId}`);

            if (!response.ok) {
                throw new Error('Failed to check status');
            }

            const data: StatusResponse = await response.json();

            if (data.status === 'completed') {
                clearStatusInterval();
                isLoading.value = false;
                if (data.predictions) {
                    predictions.value = data.predictions;
                }
            } else if (data.status === 'failed') {
                clearStatusInterval();
                isLoading.value = false;
                error.value = data.error || 'Prediction failed';
            }
        } catch (err) {
            clearStatusInterval();
            isLoading.value = false;
            error.value = err instanceof Error ? err.message : 'An error occurred while checking status';
        }
    }, 1000);
}

function clearStatusInterval() {
    if (statusInterval.value) {
        clearInterval(statusInterval.value);
        statusInterval.value = null;
    }
}

function selectPrediction(prediction: Prediction) {
    if (target && projectStore.currentLookupCodeSystemRoleIds) {
        // Fetch the concept from the codesystem to get the id within the miracum mapper backend
        const { state, isReady, isFetching, error, execute } = useGetConceptsQuery(
            projectStore.currentLookupCodeSystemRoleIds[target.id],
            prediction.code,
            null,
            1
        );
        watch(isFetching, (newVal) => {
            if (!newVal && isReady.value && state.value && state.value.length > 0) {
                currentMapping.value[`code_${target.id}`] = prediction.code;
                currentMapping.value[`meaning_${target.id}`] = prediction.meaning;
                currentMapping.value[`id_${target.id}`] = state.value[0].id;
            }
        });
        execute();
    }
}

function getConfidenceLabel(score: number): string {
    return `${(score * 100).toFixed(2)}%`;
}

function getConfidenceSeverity(score: number): 'success' | 'warning' | 'danger' {
    const percentage = score * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 40) return 'warning';
    return 'danger';
}

const submitMapping = () => {
    submitted.value = true;
    if ((projectStore.currentProjectDetails?.equivalence_required && !currentMapping.value.equivalence) || 
        (projectStore.currentProjectDetails?.status_required && !currentMapping.value.status)) {
        return;
    }
    localVisible.value = false;
    props.saveMapping(currentMapping.value);
    resetForm();
    clearStatusInterval();
};

onUnmounted(() => {
    clearStatusInterval();
});
</script>
