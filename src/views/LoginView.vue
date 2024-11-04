<template>
    <div class="login-container">
        <Card>
            <template #header>
                <div class="header-container">
                    <img src="@/assets/logo.png" alt="Logo" width="50" class="logo-margin" />
                    <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
                </div>
            </template>
            <template #title>Login</template>
            <template #content>
                <form @submit.prevent="loginUser" class="login-form">
                    <div class="flex flex-col gap-2">
                        <label for="username">Username</label>
                        <InputText id="username" v-model="username" class="full-width" disabled />
                    </div>
                    <div class="flex flex-col gap-2 mt-4">
                        <label for="password">Password</label>
                        <Password id="password" v-model="password" toggleMask :feedback="false" class="full-width"
                            :fluid="true" disabled />
                    </div>
                    <Divider />
                    <div class="flex flex-col gap-2">
                        <label for="authToken">Authentication Token</label>
                        <InputText id="authToken" v-model="authToken" class="full-width" required />
                    </div>
                    <div class="button-row mt-4">
                        <Button label="Back" class="p-button-secondary" @click="goBack" />
                        <Button label="Sign in with SSO" class="p-button-secondary" @click="signInWithSSO" />
                        <Button label="Login" type="submit" class="p-button-primary" />
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import KeycloakService from '@/lib/keycloak';

const username = ref('');
const password = ref('');
const authToken = ref('');
const router = useRouter();

const signInWithSSO = async () => {
    // SSO Logic
    const authStore = useAuthStore();
    // KeycloakService.CallInit(authStore, () => { });
    KeycloakService.CallLogin(authStore);
    router.push('/dashboard');
};

const loginUser = async () => {
    // const loginSuccessful = true;
    // const authStore = useAuthStore();
    // if (loginSuccessful) {
    //     authStore.authenticate(authToken.value);
    //     router.push('/dashboard');
    // } else {
    //     authStore.logout();
    // }
};

// const signInWithSSO = () => {
//     // SSO Logic
// };

const goBack = () => {
    router.push('/');
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.header-container {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.logo-margin {
    margin-right: 10px;
}

.text-primary {
    color: #007bff;
}

.text-xl {
    font-size: 1.25rem;
}

.font-semibold {
    font-weight: 600;
}

.divider {
    width: 1px;
    height: 24px;
    background-color: #ccc;
    margin: 0 10px;
}

.login-form {
    width: 300px;
}

.full-width {
    width: 100%;
}

.button-row {
    display: flex;
    justify-content: space-between;
}

.mt-4 {
    margin-top: 1rem;
}
</style>