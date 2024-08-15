// bootstrap
import './assets/main.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import Components from 'unplugin-vue-components/vite'
// import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     Components({
//       resolvers: [PrimeVueResolver()]
//     })
//   ]
// })
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeflex/primeflex.css'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

// import Aura from '@primevue/themes/aura'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)

// import DataTable from 'primevue/datatable'
// import Column from 'primevue/column'
// import Row from 'primevue/row'
// import ColumnGroup from 'primevue/columngroup'

// app.component('DataTable', DataTable)
// app.component('Column', Column)
// app.component('Row', Row)
// app.component('ColumnGroup', ColumnGroup)

app.mount('#app')
