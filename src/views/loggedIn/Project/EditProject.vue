<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog  modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProjectModalLabel">Edit Project</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <!-- Flex container for name and version fields -->
                        <div class="d-flex justify-content-between">
                            <div class="mb-3 me-2 flex-grow-1">
                                <label for="projectName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="projectName" v-model="project.name">
                            </div>
                            <div class="mb-3 ms-2 flex-grow-1">
                                <label for="projectVersion" class="form-label">Version</label>
                                <input type="text" class="form-control" id="projectVersion" v-model="project.version">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="projectDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="projectDescription" rows="3"
                                v-model="project.description"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        @click="closeModal">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateProject">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useProjectStore } from '@/stores/project';

// Define the events your component can emit
const emit = defineEmits(['close']);

const store = useProjectStore();
const project = ref({ ...store.currentProject });

function updateProject() {
    store.updateProject(project.value);
    putUpdateProject(project.value);
    closeModal();
    // console.log('Project updated:', project.value);
};

// update the projects
function putUpdateProject(updatedProjectData) {

    fetch(`http://localhost:8080/projects`, {
        method: 'PUT', // Use PUT method to update
        headers: {
            'Content-Type': 'application/json', // Specify JSON content type
            'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImZha2Uta2V5LWlkIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiZXhhbXBsZS11c2VycyJdLCJpc3MiOiJmYWtlLWlzc3VlciIsInBlcm0iOlsibm9ybWFsIl19.rIcV697FIuYDvAm_tWgSEvBUWerzLbmheTsUHgE3zBPsobDE1EpO1ZJkg9_xvjMzayQXL-Sl7-5mGrh7tridNg'
        },
        body: JSON.stringify(updatedProjectData) // Convert project data to JSON string
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON response
    }).then(data => {
        console.log('Project updated:', data);
        // Here you might want to update your local state or UI accordingly
    }).catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

// Example function that emits the 'close' event
function closeModal() {
    emit('close');
}
</script>

<!-- <style scoped>
@keyframes slideDown {
    from {
        transform: translateY(-100%);
    }

    to {
        transform: translateY(0);
    }
}

.modal-dialog {
    animation: slideDown 0.5s ease-out;
}
</style> -->