<template>
    <footer class="border-top footer text-muted">
        <div class="container text-white text-center">
            <div><span>This is a Mapping Tool</span></div>
            <div>
                <img src="@/assets/logo.png" alt="Logo" height="50" width="50">
                <div class="navbar-appname text-left">
                    <strong>MIRACUM</strong><br>
                    <i>Mapper</i>
                </div>
            </div>
            <div><span>MedInf 2023</span></div>
        </div>
    </footer>
</template>



<style scoped>
.border-top {
    border-top: 1px solid #e5e5e5;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    white-space: nowrap;
    line-height: 60px;
}

footer {
    background-color: #3498DB;
}

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

.navbar-appname {
    font-size: 16px;
    color: #FFFFFF;
    line-height: 1.5;
}
</style>