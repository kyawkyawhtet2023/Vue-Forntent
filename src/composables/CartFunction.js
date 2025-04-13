// import { ref, computed } from "vue";
// import { axiosAPI } from "@/stores/axios";
// import { useCartStore } from "@/stores/cartStore";
// import { useAuthStore } from "@/stores/auth";


// export function useCartFunctions() {
  
//   const cart = ref([]);

//   const loading = ref(true);
//   const empty = ref(false);

 
//   const fetchCart = async () => {

//     const storedCart = localStorage.getItem("cart");    
//     if(storedCart) {
//         cart.value = JSON.parse(storedCart);
//         loading.value = false;
//         empty.value = cart.value.length === 0;
//         return;
//         }
//         else {
//     try {
     
//        const authStore = useAuthStore();
//       const response = await axiosAPI.get("/api/cart",
//         {
//           headers: { Authorization: `Bearer ${authStore.token}`
//         },
//       }); 
//       if (response.data.success) {
//         cart.value = response.data.carts;
//         localStorage.setItem("cart", JSON.stringify(cart.value));

//         const products = JSON.parse(localStorage.getItem("products")) || [];
        
//         const updateProduct = products.find((product) => product.id === item.product.id);
//           if (updateProduct) {
//             updateProduct.user_id = "";  
//             localStorage.setItem("products", JSON.stringify(products));
//           }
//         if (cart.value.length === 0) {
//           empty.value = true;
//         }
//       } else {
//         empty.value = true;
//       }
    
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       empty.value = true;
      
//     } finally {
//       loading.value = false;
//     }
// }
//   };

// const removeFromCart = async (item) => {
//     item.removing = true;
   
//     const cartStore = useCartStore();
//     // Importing products from the useProducts composable
//     try {
//       await axiosAPI.delete(`/api/cart/${item.id}`);
//       cart.value = cart.value.filter(cartItem => cartItem.id !== item.id);
//       cartStore.fetchCartCount();
//       localStorage.setItem("cart", JSON.stringify(cart.value));
//       item.removing = false;
      

//       const products = JSON.parse(localStorage.getItem("products")) || [];
//       const product = products.find((product) => product.id === item.product.id);
//       if (product) {
//         const cartItem = product.carts.find(cart => cart.user_id === item.user_id);
//         if (cartItem) { cartItem.user_id = "";}
//       }
//       localStorage.setItem("products", JSON.stringify(products));

    

//       if (cart.value.length === 0) {
//         empty.value = true;
//       }
//     } catch (error) {
//       console.error("Error removing item:", error);
//       item.removing = false;
      
//     }
//   };





//   const totalPrice = computed(() => {
//     return cart.value.reduce((sum, item) => sum + item.quantity * (item.product_item?.price || 0), 0);
//   });

//   const updateQuantity = (item, newQuantity) => {
//     if (newQuantity < 1) {
//       newQuantity = 1;
//     }
//     if (newQuantity > item.product_item.quantity) {
//       newQuantity = item.product_item.quantity;
//     }
//     item.quantity = newQuantity;
//   };

//   const validateQuantity = (item) => {
//     if (item.quantity < 1) {
//       item.quantity = 1;
//     }
//     if (item.quantity > item.product_item.quantity) {
//       item.quantity = item.product_item.quantity;
//     }
//   };

//   return {
//     cart,
//     loading,
//     empty,
//     fetchCart,
//     removeFromCart,
//     totalPrice,
//     updateQuantity,
//     validateQuantity,
//   };
// }



import { ref, computed, watch } from "vue";
import { axiosAPI } from "@/stores/axios";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/auth";

export function useCartFunctions() {
  const cart = ref([]);
  const loading = ref(true);
  const empty = ref(false);
  const checked = ref([]);
  const selectAll = ref(false);

  const fetchCart = async () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart.value = JSON.parse(storedCart);
      loading.value = false;
      empty.value = cart.value.length === 0;
      return;
    } else {
      try {
        const authStore = useAuthStore();
        const response = await axiosAPI.get("/api/cart", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });

        if (response.data.success) {
          cart.value = response.data.carts;
          localStorage.setItem("cart", JSON.stringify(cart.value));

          const products = JSON.parse(localStorage.getItem("products")) || [];
          const updateProduct = products.find(
            (product) => product.id === item.product.id
          );
          if (updateProduct) {
            updateProduct.user_id = "";
            localStorage.setItem("products", JSON.stringify(products));
          }

          empty.value = cart.value.length === 0;
        } else {
          empty.value = true;
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        empty.value = true;
      } finally {
        loading.value = false;
      }
    }
  };

  const removeFromCart = async (item) => {
    item.removing = true;

    const cartStore = useCartStore();

    try {
      await axiosAPI.delete(`/api/cart/${item.id}`);
      cart.value = cart.value.filter((cartItem) => cartItem.id !== item.id);
      cartStore.fetchCartCount();
      localStorage.setItem("cart", JSON.stringify(cart.value));
      item.removing = false;

      const products = JSON.parse(localStorage.getItem("products")) || [];
      const product = products.find((product) => product.id === item.product.id);
      if (product) {
        const cartItem = product.carts.find((cart) => cart.user_id === item.user_id);
        if (cartItem) {
          cartItem.user_id = "";
        }
      }
      localStorage.setItem("products", JSON.stringify(products));

      if (cart.value.length === 0) {
        empty.value = true;
      }
    } catch (error) {
      console.error("Error removing item:", error);
      item.removing = false;
    }
  };

  const totalPrice = computed(() =>
    checked.value.reduce((sum, item) => sum + item.quantity * (item.product_item?.price || 0), 0)
  );

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > item.product_item.quantity)
      newQuantity = item.product_item.quantity;
    item.quantity = newQuantity;
  };

  const validateQuantity = (item) => {
    if (item.quantity < 1) item.quantity = 1;
    if (item.quantity > item.product_item.quantity)
      item.quantity = item.product_item.quantity;
  };

  const selectAllItems = () => {
    cart.value.forEach((item) => {
      if (item.product_item?.quantity > 0) {
        item.selected = selectAll.value;
      }
    });
  };
  

  // Watch cart to auto-update `checked`
  watch(
    cart,
    () => {
      checked.value = cart.value.filter((item) => item.selected);
    },
    { deep: true }
  );

  const hasSelectedItems = computed(() => checked.value.length > 0);
  const getTotalQuantity = computed(() => {
    return checked.value.reduce((total, item) => total + item.quantity, 0);
  });




  return {
    cart,
    checked,
    loading,
    empty,
    fetchCart,
    removeFromCart,
    totalPrice,
    updateQuantity,
    validateQuantity,
    selectAll,
    selectAllItems,
    hasSelectedItems,
    getTotalQuantity,
  };
}
