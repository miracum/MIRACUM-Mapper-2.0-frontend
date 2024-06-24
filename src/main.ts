import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Row from 'primevue/row'
import ColumnGroup from 'primevue/columngroup'

app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Row', Row);
app.component('ColumnGroup', ColumnGroup);

app.mount('#app')
