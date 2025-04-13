<template>
  <div class="login-form">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { axiosAPI } from '@/stores/axios';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  try {
    // Get CSRF token first
    await axiosAPI.get('/sanctum/csrf-cookie');

    // Send login request
    const response = await axiosAPI.post('/api/login', {
      email: email.value,
      password: password.value
    });

    const { token, user } = response.data;

    if (token && user) {
      authStore.setToken(token); // Save token and apply to axios
      authStore.setUser(user);   // Save user in store + localStorage
      error.value = '';
      localStorage.removeItem('products'); // Remove products from localStorage if exists
      localStorage.removeItem('cart'); // Remove cart from localStorage if exists

      // Redirect after login
      const redirectPath = router.currentRoute.value.query.redirect || '/dashboard';
      router.push(redirectPath);
    } else {
      throw new Error('Invalid response from server.');
    }

  } catch (err) {
    console.error('Login error:', err);
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
  }
};
</script>


<style scoped>
/* Custom styling */
.login-form {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
