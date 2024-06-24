<template>
    <div>
        <Header :buttons="headerButtons" />
        <div class="container-fluid">
            <main role="main" class="pb-3">
                <ProjectTable :elements="projectElements" />
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
// import EditProjectModal from './EditProjectModal.vue'; //only show modal buttons when hovering over the row
// import ConfirmDeleteModal from './ConfirmDeleteModal.vue'; //only show modal buttons when hovering over the row
// import CreateMappingModal from './CreateMappingModal.vue'; //only show modal buttons when hovering over the row
import { RouterLink } from 'vue-router'
export default {
    props: {
        buttons: Array
    }
}
</script>

<style scoped></style>