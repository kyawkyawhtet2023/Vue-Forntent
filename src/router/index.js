
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import CartView from '@/views/CartView.vue';
import OrderView from '@/views/OrderView.vue';
import Setting from '@/views/Setting.vue';
import Help from '@/views/Help.vue';
import Policy from '@/views/Policy.vue';
import Service from '@/views/Service.vue';
import ShowProduct from '@/views/ShowProduct.vue';
import Login from '@/components/Login.vue';
import Show from '@/components/show.vue';
import Create from '@/components/create.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/cart', name: 'cart', component: CartView, meta: { requiresAuth: true }  },
  { path: '/order', name: 'Order', component: OrderView , meta: { requiresAuth: true } },
  { path: '/setting', name: 'setting', component: Setting },
  { path: '/help', name: 'help', component: Help },
  { path: '/policy', name: 'policy', component: Policy },
  { path: '/service', name: 'service', component: Service },
  { path: '/product/:id', name: 'ShowProduct', props: true, component: ShowProduct },
  { path: '/create', name: 'Create', component: Create },
  { path: '/login', component: Login },
  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: Show, 
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const storedUser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

  if (to.meta.requiresAuth && !authStore.user && !storedUser) {
    // If the user is not authenticated, store the current route path
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    // Restore user from localStorage if necessary
    if (!authStore.user && storedUser) {
      authStore.user = storedUser;
    }
    next();
  }
});


export default router;

