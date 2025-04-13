// composables/useProductList.js
import { ref } from "vue";
import { useProducts } from "@/composables/products";
import { useAuth } from "@/composables/user";
import { useCartStore } from "@/stores/cartStore";
import { axiosAPI } from "@/stores/axios";
import { useAuthStore } from "@/stores/auth";

export function useProductList() {
  const { products, fetchData } = useProducts();
  const { user } = useAuth();
  const cartStore = useCartStore();
  const authStore = useAuthStore();

  const isInCart = (product) => {
    return (
      Array.isArray(product.carts) &&
      product.carts.length > 0 &&
      user.value &&
      product.carts.some((cart) => cart.user_id === user.value.id)
    );
  };

  const toggleCart = async (product) => {
    if (!user.value) {
      console.error("User is not logged in.");
      return;
    }

    product.isLoading = true;
    try {
      saveLoadingState(product);
      isInCart(product) ? await removeFromCart(product) : await addToCart(product);
    } catch (error) {
      console.error("Error toggling cart:", error);
    } finally {
      product.isLoading = false;
      saveLoadingState(product);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await axiosAPI.post(
        "/api/cart",
        {
          product_id: product.id,
          product_item_id: product.product_items[0]?.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      );

      if (response.data.success) {
        const updateCart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCart.push(response.data.cart);
        localStorage.setItem("cart", JSON.stringify(updateCart));
        product.carts.push(response.data.cart);
        cartStore.increaseCount();
        localStorage.setItem("products", JSON.stringify(products.value));
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      throw error;
    }
  };

  const removeFromCart = async (product) => {
    try {
      const cartItem = product.carts.find(
        (cart) => cart.user_id === user.value?.id
      );
      if (!cartItem) return;

      await axiosAPI.delete(`/api/cart/${cartItem.id}`);

      let updateCart = JSON.parse(localStorage.getItem("cart")) || [];
      updateCart = updateCart.filter((cart) => cart.id !== cartItem.id);
      localStorage.setItem("cart", JSON.stringify(updateCart));

      product.carts = product.carts.filter((cart) => cart.id !== cartItem.id);
      cartStore.decreaseCount();
      localStorage.setItem("products", JSON.stringify(products.value));
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const saveLoadingState = (product) => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = savedProducts.map((p) => {
      if (p.id === product.id) p.isLoading = product.isLoading;
      return p;
    });
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  // Infinite Scroll
  const page = ref(1);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);

  const handleScroll = async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollY + windowHeight >= fullHeight - 10 && !isLoadingMore.value && hasMore.value) {
      isLoadingMore.value = true;
      page.value++;
      const newProducts = await fetchData(page.value);
      if (!newProducts || newProducts.length === 0) hasMore.value = false;
      isLoadingMore.value = false;
    }
  };

  const init = () => {
    fetchData(page.value);
    window.addEventListener("scroll", handleScroll);
    cartStore.fetchCartCount();
  };

  const cleanup = () => {
    window.removeEventListener("scroll", handleScroll);
  };

  return {
    products,
    removeFromCart,
    addToCart,
    isInCart,
    toggleCart,
    init,
    cleanup,
    isLoadingMore,
  };
}
