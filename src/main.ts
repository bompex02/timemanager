import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import storage from 'vue3-storage'

const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.use(storage({
    namespace: 'app_', // prefix for all keys
    storage: localStorage,
    expire: 60 * 60 // 1h expiration
}));

app.mount('#app')
