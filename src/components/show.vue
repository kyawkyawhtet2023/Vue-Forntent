<template>
  <div class="dashboard">
    <h2>Welcome, {{ user?.name }}</h2>
    <p>Email: {{ user?.email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  menuvisible: Boolean
});

const { user, logout: storeLogout } = useAuth();

const logout = async () => {
  await storeLogout();         // Call Pinia store logout
  router.push('/login');       // Redirect to login
};
</script>


