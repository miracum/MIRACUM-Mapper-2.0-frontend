<template>
    <div class="col">
        <div class="form-group d-flex m-3 justify-content-center">
            <div class="col-6 pr-1 position-relative">
                <input type="text" id="customSearchInput" class="form-control flex-grow-1"
                    placeholder="Search for a project...">
                <span class="search-icon">
                    <i class="fas fa-search icon"></i>
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
                        <div class="d-flex justify-content-between align-items-center custom-div">
                            <div class="title">
                                <h5 class="name-field">{{ element.name }}</h5>
                                <!-- <router-link :to="{ name: 'About' }" class="text-decoration-none title">
                                    <h5 class="name-field">{{ element.name }}</h5>
                                </router-link><br> -->
                                <p class="version">Version : <span class="version-field">{{ element.version
                                        }}</span></p>
                                <h6 class="description">{{ element.description }}</h6>
                            </div>
                            <div>
                                <button class="btn edit-button" @click="openEditModal(element.id)">
                                    <i class="fa-solid fa-pen-to-square icon"></i>
                                </button>
                                <!-- Replace with Vue component for editing -->
                                <!-- <EditProjectModal :element="element" v-if="isEditModalOpen(element.Id)" /> -->
                                <button class="btn delete-button" @click="openDeleteModal(element.id)">
                                    <i class="fas fa-trash icon"></i>
                                </button>
                                <!-- Replace with Vue component for confirmation -->
                                <!-- <ConfirmDeleteModal :element="element" v-if="isDeleteModalOpen(element.Id)" /> -->
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// import EditProjectModal from './EditProjectModal.vue'; //only show modal buttons when hovering over the row
// import ConfirmDeleteModal from './ConfirmDeleteModal.vue'; //only show modal buttons when hovering over the row

export default {
    props: {
        elements: Array
    },
    // components: {
    //     EditProjectModal,
    //     ConfirmDeleteModal
    // },
    data() {
        return {
            openModals: {
                edit: null,
                delete: null
            }
        };
    },
    methods: {
        openEditModal(id) {
            this.openModals.edit = id;
        },
        openDeleteModal(id) {
            this.openModals.delete = id;
        },
        isEditModalOpen(id) {
            return this.openModals.edit === id;
        },
        isDeleteModalOpen(id) {
            return this.openModals.delete === id;
        }
    }
}
</script>


<style scoped>
/* @import url('https://cdn.datatables.net/1.10.24/css/jquery.dataTables.css'); */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'); */
/* @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'); */
/* @import url('./MIRACUM_Mapper.styles.css'); */
@import url('@/assets/miracum-mapper-old.css');
</style>