<template>
    <div class="login-container">
        <h1>Login</h1>
        <form>
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="username" />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" />
            </div>
            <!-- Divider -->
            <hr />
            <!-- Additional field for Auth Token -->
            <div class="form-group">
                <label for="authToken">Auth Token (Debug)</label>
                <input type="text" id="authToken" v-model="authToken" />
            </div>
            <button type="submit" @click.prevent="loginUser">Login</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const username = ref('');
const password = ref('');
const authToken = ref(''); // Add this line
const router = useRouter();

const loginUser = async () => {
    // Your login logic here
    const loginSuccessful = true; // Placeholder for actual login logic
    const authStore = useAuthStore();
    if (loginSuccessful) {
        authStore.authenticate(authToken.value);
        router.push('/dashboard');
    } else {
        // Handle login failure (e.g., display an error message)
        authStore.logout();
    }
};
</script>

<style scoped>
.login-container {
    max-width: 600px;
    min-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

h1 {
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>