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

import App from './App.vue'
import router from './router'

import AppState from './plugins/appState.js'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import Noir from './presets/Noir.js'
// import Noir from './presets/Noir.js'

const app = createApp(App)

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

app.use(createPinia())
app.use(router)

app.use(AppState)

// app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)

app.component('ThemeSwitcher', ThemeSwitcher)

app.mount('#app')
