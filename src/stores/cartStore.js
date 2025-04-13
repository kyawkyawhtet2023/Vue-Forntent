import { defineStore } from "pinia";
import { axiosAPI } from "@/stores/axios";
import { useAuthStore } from "@/stores/auth";

export const useCartStore = defineStore("cart", {
  state: () => ({
    count: 0,
    cartItems: [],
  }),

  actions: {
    async fetchCartCount() {
      const authStore = useAuthStore(); // moved inside
      try {
        const response = await axiosAPI.get("/api/cart/count", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.count = response.data.count;
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    },

    async fetchCartItems() {
      const authStore = useAuthStore(); // moved inside
      try {
        const response = await axiosAPI.get("/api/cart", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });

        if (response.data.success) {
          this.cartItems = response.data.carts;
          localStorage.setItem("cart", JSON.stringify(this.cartItems));
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },

    increaseCount() {
      this.count += 1;
    },

    decreaseCount() {
      if (this.count > 0) this.count -= 1;
    },
  },
});
