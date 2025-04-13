import { ref } from "vue";
import { axiosAPI } from "@/stores/axios";

export function useProducts() {
  const products = ref([]);

  const fetchData = async (page = 1) => {
    try {
      const storedProducts = localStorage.getItem("products");

      if (!storedProducts || JSON.parse(storedProducts).length === 0) {
        // No products in localStorage or empty list
        const response = await axiosAPI.get(`/api/products?page=${page}`);
        const newProducts = response.data.data;

        products.value = newProducts;
        localStorage.setItem("products", JSON.stringify(newProducts));
        console.log("Fetched and saved products to localStorage");

        return newProducts;
      } else {
        // Load from localStorage
        products.value = JSON.parse(storedProducts);
        console.log("Loaded products from localStorage");

        return products.value;
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  };

  return { products, fetchData };
}
