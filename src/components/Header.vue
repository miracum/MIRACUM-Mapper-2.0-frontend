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

<script>
import { RouterLink } from 'vue-router'
export default {
    props: {
        buttons: Array
    }
}
</script>


<style scoped>
/* @import url('https://cdn.datatables.net/1.10.24/css/jquery.dataTables.css'); */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'); */
/* @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'); */
/* @import url('./MIRACUM_Mapper.styles.css'); */

a.navbar-brand {
    white-space: normal;
    text-align: center;
    word-break: break-all;
}

a {
    color: #0077cc;
}

.btn-primary {
    color: #fff;
    background-color: #1b6ec2;
    border-color: #1861ac;
}

.nav-pills .nav-link.active,
.nav-pills .show>.nav-link {
    color: #fff;
    background-color: #1b6ec2;
    border-color: #1861ac;
}

.border-top {
    border-top: 1px solid #e5e5e5;
}

.border-bottom {
    border-bottom: 1px solid #e5e5e5;
}

.box-shadow {
    box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
}

button.accept-policy {
    font-size: 1rem;
    line-height: inherit;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    white-space: nowrap;
    line-height: 60px;
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

header,
footer {
    background-color: #3498DB;
}

/* Footer */
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px 0;
    color: white;
}

.footer .container {
    display: flex;
    justify-content: space-between;
    /* Distribute space between items */
    align-items: center;
    /* Align items vertically */
}

.footer .container>div {
    display: flex;
    align-items: center;
    /* Align items vertically within each div */
}

.footer img {
    margin-right: 10px;
    /* Add some space between the logo and text */
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

#elementTable {
    background-color: #f2f2f2;
}

table.dataTable.no-footer {
    border-bottom: none;
}

#elementTable_wrapper.dataTables_wrapper {
    background-color: #D9D9D9;
}

#customSearchButton {
    background-color: #3498DB;
    color: #636E72;
    border: none;
    cursor: pointer;
}

#customSearchInput {
    border-radius: 25px;
    margin-right: 30px;
}

table.custom-table thead th {
    background-color: #D9D9D9;
    border-bottom: 5px solid white;
}

table.custom-table tbody td {
    background-color: #D9D9D9;
}

.search-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
}

.title {
    line-height: 1px;
}

.card {
    border: none;
}

#elementTable {
    width: 100%;
}

.dataTables_paginate .paginate_button {
    border: none !important;
    color: #636E72 !important;
}

div.bottom.ml-3.col-md-5 {}

.dataTables_paginate .paginate_button.current {
    background-color: #636E72 !important;
}

.dataTables_paginate .paginate_button .fas {
    vertical-align: middle;
    margin-right: 5px;
}

.dataTables_length select {
    width: auto;
    padding: 5px;
    border-radius: 4px;
    background-color: white;
    color: #636E72;
}

.dataTables_length {
    margin-left: 15px;
    color: #636E72;
}

.dataTables_wrapper .dataTables_info {
    color: #636E72;
}

label {
    color: #636E72;
}

.icon {
    color: #636E72;
}

.title {
    font-size: 18px;
    color: #636E72;
}

.version {
    font-size: 12px;
}

.cursor {
    cursor: pointer;
}

/* Mapping table */

#mappingTable table {
    border-collapse: collapse;
    width: 100%;
}

#mappingTable th,
#mappingTable td {
    border: 1px solid #898d8f;
    padding: 8px;
    text-align: left;
}

.custom-thead-dark {
    background-color: #636E72;
    color: ghostwhite;
}

.table-panel {
    background-color: #D9D9D9;
}

/* panel */

.panel-background {
    background-color: #D9D9D9;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.98);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.5);
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-left: 50px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.description {
    color: #b7b3b3;
    font-size: small;
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