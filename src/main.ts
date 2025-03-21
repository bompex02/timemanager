import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import { initializeApp } from "firebase/app"; // Import Firebase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-wBr5tn4tq40aFNwPaMtwMN9uzc1lyq4",
  authDomain: "timemanager-2b521.firebaseapp.com",
  projectId: "timemanager-2b521",
  storageBucket: "timemanager-2b521.firebasestorage.app",
  messagingSenderId: "463303248439",
  appId: "1:463303248439:web:4d9c1b1e7e45c8c141cdb2"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)
app.use(PrimeVue);

app.mount('#app')
