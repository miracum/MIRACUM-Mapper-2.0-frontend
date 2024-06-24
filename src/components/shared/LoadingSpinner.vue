<template>
    <div id="loadingOverlay">
        <div>
            <p>Data is being loaded...</p>
            <div class="spinner"></div>
        </div>
    </div>
</template>

<style scoped>
#loadingOverlay {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

/* .loading-overlay {
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
} */

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
</style>