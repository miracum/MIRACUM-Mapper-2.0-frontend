import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './style.css'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import AppState from './plugins/appState.js'
import Noir from './presets/Noir.js'
import authStorePlugin from './plugins/authStore'
import mappingStorePlugin from './plugins/mappingStore'
import projectStorePlugin from './plugins/projectStore'
import { useAuthStore } from './stores/auth'
import KeycloakService from './lib/keycloak'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

// Create Pinia Instance
const pinia = createPinia()

// Persisted State in Pinia
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(authStorePlugin, { pinia })
const authStore = useAuthStore()

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false
    }
  }
})

app.directive('tooltip', Tooltip)

app.use(mappingStorePlugin, { pinia })
app.use(projectStorePlugin, { pinia })

app.use(router)

app.use(AppState)

app.use(ConfirmationService)
app.use(ToastService)

// app.component('ThemeSwitcher', ThemeSwitcher)

app.mount('#app')

KeycloakService.CallInit(authStore, () => {})
