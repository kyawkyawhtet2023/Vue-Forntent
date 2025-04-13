<template>
  <div class="container">
    <div class="cart-container">
      <div class="cart-header">
        <div>
          <input type="checkbox" v-model="selectAll" @change="selectAllItems" /> 
          Select All 
        </div>

        <div class="header-name-container">
          <ion-icon name="cart-outline" class="header-icon" ></ion-icon>
          <h3>Shopping Cart</h3> 
        </div>

        <div>
          <button @click="ClearCart" class="clear-btn">Clear Cart</button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="empty-cart">
        <skeleton type="text" width="100%" height="20px" borderRadius="5px" />
        <skeleton type="text" width="100%" height="20px" borderRadius="5px" />
        <skeleton type="text" width="100%" height="20px" borderRadius="5px" />
        <skeleton type="text" width="100%" height="20px" borderRadius="5px" />
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="empty" class="empty-cart">
        <p>Your cart is empty.</p>
        <router-link to="/">Continue Shopping</router-link>
      </div>

      <!-- Cart Items -->
      <div v-else>
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <input
            type="checkbox"
            v-model="item.selected"
            
            :disabled="!item.product_item?.quantity"
          />
          <div class="product-image-wrapper">
            <div v-if="item.product_item?.image || item.product?.image_1" class="product-image-container">
              <router-link :to="{ name: 'ShowProduct', params: { id:item.product.id } }"> 
                <img
                  :src="item.product_item?.image"
                  alt="Product Image"
                  class="product-image"
                  v-if="item.product_item?.image"
                />
                <img
                  :src="item.product?.image_1"
                  alt="Product Image"
                  class="product-image"
                  v-else
                /> 
              </router-link> 
            </div>
            <div v-else class="product-image-placeholder">
              <skeleton type="circle" width="80px" height="80px" borderRadius="50%" />
            </div>
          </div>
          <div class="cart-details">
            <router-link :to="{ name: 'ShowProduct', params: { id: item.product.id } }">
              <h5 class="product-name">{{ item.product.name }}</h5>
            </router-link> 
            <h5>{{ item.product_item?.name }}</h5>
            <p>{{ item.product_item?.price.toLocaleString() }} Ks.</p>

            <div class="base-container">
              <div class="quantity-container">
                <div v-if="item.product_item?.quantity > 0" class="quantity-control">
                  <button @click="updateQuantity(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    :max="item.product_item.quantity"
                    @change="validateQuantity(item)"
                  />
                  <button @click="updateQuantity(item, item.quantity + 1)" :disabled="item.quantity === item.product_item.quantity">+</button>
                </div>
                <span v-else class="out-stock">Out of Stock</span>
              </div>
              <button
                class="remove-btn"
                :disabled="item.removing"
                :style="{ opacity: item.removing ? 0.5 : 1 }"
                @click="removeFromCart(item)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
    <div class="cart-summary" v-if="hasSelectedItems">
        <div class="summary-header-container">
          <h3>Cart Summary</h3>
          <div class="show-checked">
            <span> 
              <strong> Total items :</strong>
              <span > {{ checked.length }}</span>
            </span>
            <span>
              <strong> Total Quantity:</strong>
              <span>{{ getTotalQuantity }}</span>
            </span>
          </div>

        </div>
          <div v-for="item in checked" :key="item.id" class="checked-item">
            <div class="checked-image-wrapper">
              <div v-if="item.product_item?.image || item.product?.image_1" class="checked-image-container">
                <router-link :to="{ name: 'ShowProduct', params: { id:item.product.id } }"> 
                  <img
                    :src="item.product_item?.image"
                    alt="Product Image"
                    class="product-image"
                    v-if="item.product_item?.image"
                  />
                  <img
                    :src="item.product?.image_1"
                    alt="Product Image"
                    class="product-image"
                    v-else
                  /> 
                </router-link> 
              </div>
            </div>
            <div class="checked-product-container">
              <p class="name">{{ item.product.name }} </p>
              <div class="item-container">
                <p>{{ item.product_item?.name }}</p>
                <p> {{ item.quantity }} x {{ (item.product_item?.price) .toLocaleString()}} Ks.</p>
                <p>{{ (item.product_item?.price * item.quantity).toLocaleString() }} Ks.</p>
              </div>
            </div>
          </div>
          <p>Total: <strong>{{ totalPrice.toLocaleString() }} Ks.</strong></p>
          <button class="checkout-btn">Checkout</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCartFunctions } from "@/composables/CartFunction";
import { useCartStore } from "@/stores/cartStore";



const {
  cart,
  selectAll,
  selectAllItems,
  removeSelectedItems,
  checked,
  hasSelectedItems,
  totalPrice,
  loading,
  empty,
  fetchCart,
  updateQuantity,
  validateQuantity,
  removeFromCart,
  updateTotalPrice,
  getTotalQuantity,
                  } = useCartFunctions();
const cartStore = useCartStore();
const fetchCartItems = async () => {
  try {
    await cartStore.fetchCartItems();
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
onMounted(() => {
  fetchCartItems()
  fetchCart(); 

});
</script>



<style scoped>
.container {
  display: flex;
  gap: 2%;
  padding: 10px;
}

/* Wrapper to allow cart-container to scroll if needed */
.cart-container-wrapper {
  flex: 0 0 60%;
  max-height: 100vh;
  overflow-y: auto;
  padding-right: 10px;
}

.cart-container {
  padding: 0;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 0px 10px;
  background: var(--primary);
  color: white;
}

.header-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  font-size: 45px;
}

h3 {
  text-align: center;
}

.clear-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.clear-btn:hover {
  background: darkred;
}

input[type="checkbox"] {
  margin-right: 10px;
}
input:disabled {
  cursor: not-allowed;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
}

.product-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 5px;
  background-color: aliceblue;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}
.product-name{
  color: rgba(0, 0, 0, 0.9);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  user-select: none;
  margin: 0;
  padding: 0;
}

.cart-details {
  flex-grow: 1;
}

.base-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-control button {
  background-color: var(--primary);
  color: #ddd;
  border: none;
  border-radius: 3px;
  padding: 5px 5px;
  transition: background-color 0.2s ease;
}

.quantity-control button:active {
  background-color: #444;
}

.quantity-control button:disabled {
  background: red;
  cursor: not-allowed;
}

.quantity-control input {
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}

.quantity-control input:focus {
  outline-color: var(--primary);
}

.out-stock {
  color: red;
  font-weight: bold;
}

.remove-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

/* Sticky Cart Summary */
.cart-summary {
  flex: 0 0 37%;
  position: sticky;
  top: 0;
  align-self: start;
  background: #fff;
  z-index: 100;
  padding: 10px;
  height: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 5px;
}

.summary-header-container h3 {
  margin: 0;
  color: var(--primary);
}

.show-checked {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: small;
  color: var(--primary);
  align-items: center;
}

.checked-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.checked-image-wrapper {
  width: 60px;
  height: 60px;
  background-color: aliceblue;
}

.checked-image-container img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.checked-product-container {
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.checked-product-container .name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  user-select: none;
  margin: 0;
  padding: 0;
}

.item-container {
  display: flex;
  justify-content: space-between;
}

.item-container p {
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
}

.checkout-btn {
  background: green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>