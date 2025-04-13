import { useAuthStore } from '@/stores/auth';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { axiosAPI } from '@/stores/axios';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const user = computed(() => authStore.user);

  onMounted(async () => {
    console.log('User in Pinia before fetch:', authStore.user);

    if (!authStore.user) {
      await authStore.fetchUser();
    }

    console.log('User in Pinia after fetch:', authStore.user);
  });

  const login = async () => {
    try {
   
      const response = await axiosAPI.post('/login', { 
        email: email.value, 
        password: password.value 
      }, { withCredentials: true });
  
  
      
      if (response.data.user) {
        
        authStore.user = response.data.user; 
        authStore.token = response.data.token;
      }
  
      error.value = '';
      
      const redirectPath = router.currentRoute.value.query.redirect || '/dashboard';
      router.push(redirectPath);
    
  
    } catch (err) {
      console.error('Login error:', err);
      error.value = err.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  };



  return {
    user,
    login,
    logout: authStore.logout,
  };
}
