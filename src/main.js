import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/Global.css';
import { useAuthStore } from '@/stores/auth';

const app = createApp(App); 
const pinia = createPinia(); 


app.use(pinia); // Use Pinia
app.use(router); // Use Vue Router
const authStore = useAuthStore();
authStore.initialize();
app.mount('#app'); 
