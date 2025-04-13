<template>
    <div class="register">
      <h2>Register</h2>
      
      <form @submit.prevent="register">
        <div>
          <label>Name:</label>
          <input type="text" v-model="name" required />
        </div>
  
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
  
        <div>
          <label>Phone:</label>
          <input type="text" v-model="phone" required />
        </div>
  
        <div>
          <label>Code:</label>
          <input type="text" v-model="code" required />
        </div>
  
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
  
        <div v-if="error" class="error">{{ error }}</div>
  
        <button type="submit">Register</button>
      </form>
  
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { axiosAPI } from '@/stores/axios';
  import { useRouter } from 'vue-router';
  
  
  const name = ref('');
  const email = ref('');
  const phone = ref('');
  const code = ref('');
  const password = ref('');
  const error = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
        await axiosAPI.get('/sanctum/csrf-cookie', { withCredentials: true });
  
      const response = await axiosAPI.post('/register', {
        name: name.value,
        email: email.value,
        phone: phone.value,
        code: code.value,
        password: password.value,
      }, { withCredentials: true });
  
      console.log('Registration successful:', response.data);
      error.value = '';
  
      router.push('/login'); // Redirect to login page
    } catch (err) {
      console.error('Full Error:', err.response);
      error.value = err.response?.data?.message || 'Registration failed.';
    }
  };
  </script>
  
<style scoped>
  .register {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
</style>
  