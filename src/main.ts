// import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './style.css'
// import './flags.css'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
// import Aura from '@primevue/themes/aura'

// import 'primevue/resources/themes/aura/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import AppState from './plugins/appState.js'
// import ThemeSwitcher from './components/ThemeSwitcher.vue'
import Noir from './presets/Noir.js'
import authStorePlugin from './plugins/authStore'
import mappingStorePlugin from './plugins/mappingStore'
import projectStorePlugin from './plugins/projectStore'
import { useAuthStore } from './stores/auth'
import KeycloakService from './lib/keycloak'
// import KeycloakService from './lib/keycloak'
// import { useAuthStore } from './stores/auth'
// import Noir from './presets/Noir.js'

const app = createApp(App)

// Create Pinia Instance
const pinia = createPinia()

// Persisted State in Pinia
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(authStorePlugin, { pinia })
const authStore = useAuthStore()

function renderApp() {
  // KeycloakService.CallInitStore(authStore)
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

  app.use(mappingStorePlugin, { pinia })
  app.use(projectStorePlugin, { pinia })

  app.use(router)

  app.use(AppState)

  // app.use(PrimeVue)
  app.use(ConfirmationService)
  app.use(ToastService)

  // app.component('ThemeSwitcher', ThemeSwitcher)

  app.mount('#app')

  KeycloakService.CallInit(authStore, () => {})
}

renderApp()

// KeycloakService.CallInit(authStore, renderApp)
