import { defineStore } from 'pinia';
import { axiosAPI } from '@/stores/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem('auth_token', token);
      axiosAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      delete axiosAPI.defaults.headers.common['Authorization'];
    },

    async fetchUser() {
      try {
        const response = await axiosAPI.get('/user', { withCredentials: true });
        this.setUser(response.data);
        console.log("Fetched user:", response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.clearAuth();
      }
    },

    async logout() {
      try {
        await axiosAPI.post('/api/logout', {}, { withCredentials: true }); // optional
      
      } catch (e) {
        console.warn('Logout request failed, clearing auth anyway');
      }
      this.clearAuth();
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      // localStorage.removeItem('products');
      localStorage.removeItem('cart');
      localStorage.removeItem('cartCount');
    },

    initialize() {
      // Call this once on app start
      if (this.token) {
        axiosAPI.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  }
});
