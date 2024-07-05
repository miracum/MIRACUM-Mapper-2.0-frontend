<template>
    <header>
        <nav class="navbar navbar-expand-lg navbar-toggleable-sm navbar-dark">
            <div class="container-fluid m-4">
                <RouterLink to="/dashboard" class="navbar-brand">
                    <div class="d-flex">
                        <img src="@/assets/logo.png" alt="Logo" width="55">
                        <div class="navbar-appname">
                            <strong>MIRACUM</strong><br>
                            <i>Mapper</i>
                        </div>
                    </div>
                </RouterLink>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
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

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
    buttons: Array
});
</script>


<style scoped>
a.navbar-brand {
    white-space: normal;
    text-align: center;
    word-break: break-all;
}

.nav-pills .nav-link.active,
.nav-pills .show>.nav-link {
    color: #fff;
    background-color: #1b6ec2;
    border-color: #1861ac;
}

/* Header - NavBar */
.navbar-dark .navbar-nav .nav-link {
    color: white;
    padding: 4px 25px;
    cursor: pointer;
}

.navbar-dark .navbar-nav .nav-link:hover {
    background-color: white;
    color: #3498DB;
    border-radius: 50px;
    transition: all 0.3s ease;
}

header {
    background-color: #3498DB;
}

.navbar {
    height: 100px;
}

/* Logo */
.navbar-brand img {
    vertical-align: middle;
    margin-right: 10px;
}

/* Application name */
.navbar-appname {
    font-size: 16px;
    color: #FFFFFF;
    line-height: 1.5;
}

.navbar-nav .nav-item {
    margin-right: 10px;
}

a.disabled,
.navbar-dark .navbar-nav .nav-link.disabled {
    color: #999;
    /* Grey out */
    pointer-events: none;
    /* Prevent clicking */
    text-decoration: none;
    cursor: not-allowed;
}
</style>