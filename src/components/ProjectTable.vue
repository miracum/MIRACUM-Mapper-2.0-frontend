<template>
    <div class="col">
        <div class="form-group d-flex m-3 justify-content-center">
            <div class="col-6 pr-1 position-relative">
                <input type="text" id="customSearchInput" class="form-control flex-grow-1"
                    placeholder="Search for a project...">
                <span class="search-icon">
                    <FontAwesomeIcon :icon="faSearch" class="icon" />
                </span>
            </div>
        </div>

        <div v-if="elements.length === 0" class="text-center">
            <h3>No data to show yet.</h3>
        </div>

        <table id="projectTable" class="custom-table" v-else>
            <thead>
                <tr>
                    <th>Created Projects</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="element in elements" :key="element.Id">
                    <td>
                        <div class="d-flex justify-content-between align-items-center custom-div"  @click="openProject(element.id)">
                            <div class="title">
                                <h5 class="name-field">{{ element.name }}</h5>
                                <p class="version">Version : <span class="version-field">{{ element.version
                                        }}</span></p>
                                <h6 class="description">{{ element.description }}</h6>
                            </div>
                            <div>
                                <button class="btn edit-button" @click.stop="openEditModal(element.id)">
                                    <FontAwesomeIcon :icon="faPenToSquare" class="icon" />
                                </button>
                                <EditProjectModal :element="elementToEdit" v-if="openModals.edit"
                                    @close="openModals.edit = null" />
                                <button class="btn delete-button" @click.stop="openDeleteModal(element.id)">
                                    <FontAwesomeIcon :icon="faTrashCan" class="icon" />
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import EditProjectModal from '../views/loggedIn/Project/EditProject.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare, faTrashCan, faSearch } from '@fortawesome/free-solid-svg-icons'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    elements: Array
});

const router = useRouter();

const openModals = ref({
    edit: null,
    delete: null
});

const elementToEdit = computed(() => {
    return props.elements.find(element => element.id === openModals.value.edit);
});

function openEditModal(id) {
    console.log('Opening edit modal for project:', id);
    openModals.value.edit = id;
}

function openDeleteModal(id) {
    openModals.value.delete = id;
}

function openProject(id) {
    router.push(`/projects/${id}/mappings`);
}
</script>


<style scoped>
table.custom-table {
    width: 100%;
    /* border-collapse: separate; */
    /* This allows border-spacing to take effect */
    /* border-spacing: 10px; */
    /* Adjust horizontal spacing here */
}

table.custom-table tbody td {
    background-color: #D9D9D9;
    padding: 10px;
    /* Adjust vertical spacing by changing the top and bottom padding */
}

/* Additional styles for visual improvement */
table.custom-table thead th {
    padding: 10px;
    /* Optional: Adjust header cell padding to match tbody if desired */
}

.col {
    width: 100%;
}

.search-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
}

.icon {
    color: #636E72;
}

.dataTables_paginate .paginate_button .fas {
    vertical-align: middle;
    margin-right: 5px;
}

/* table.custom-table {
    width: 100%;
    table-layout: auto;
} */

table.custom-table thead th {
    background-color: #D9D9D9;
    border-bottom: 5px solid white;
}

table.custom-table tbody td {
    background-color: #D9D9D9;
}

.custom-div {
    border-radius: 17px;
    padding: 17px;
    transition: box-shadow 0.3s;
    height: 84px;
    background-color: white;
}

.custom-div:hover {
    border: 1px solid #D9D9D9;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
}

.version {
    font-size: 12px;
}

.title {
    font-size: 18px;
    color: #636E72;
    line-height: 1px;
}

.description {
    color: #b7b3b3;
    font-size: small;
}

/* #projectTable {
    background-color: #f2f2f2;
}

#projectTable_wrapper.dataTables_wrapper {
    background-color: #D9D9D9;
}

#projectTable {
    width: 100%;
} */
</style>