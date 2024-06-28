<template>
    <div class="modal fade" id="editProjectModal" tabindex="-1" aria-labelledby="editProjectModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProjectModalLabel">Edit Project</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="projectName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="projectName" v-model="project.name">
                        </div>
                        <div class="mb-3">
                            <label for="projectVersion" class="form-label">Version</label>
                            <input type="text" class="form-control" id="projectVersion" v-model="project.version">
                        </div>
                        <div class="mb-3">
                            <label for="projectDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="projectDescription" rows="3"
                                v-model="project.description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateProject">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const project = ref({
    name: '',
    version: '',
    description: ''
});

// Example function to update project details
const updateProject = () => {
    // Implement project update logic here
    console.log('Project updated:', project.value);
};
</script>