<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-toggleable-sm navbar-dark">
            <div class="container-fluid m-4">
                <!-- Content here remains the same -->
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item" v-for="button in buttons" :key="button.label">
                            <a class="nav-link" :class="{ disabled: button.disabled }" @click="button.action">{{
                                button.label }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    props: {
        buttons: Array
    }
}
</script>