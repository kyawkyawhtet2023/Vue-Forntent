<template>
  <div class="container" v-if="!loading && product && product.name">
    <!-- Back Button -->
    <ion-icon name="arrow-back-circle-outline" class="back-icon" @click="$router.go(-1)"></ion-icon>

    <div class="product-container">
      <div class="image-container">
        <div class="main-img-container">
          <img :src="selectedImage" id="main-img" />
        </div>
        <div class="row-image-container">
          <div v-for="(image, index) in imageFields" :key="index">
            <div class="row-image">
              <img :src="image" :alt="'Product Image ' + (index + 1)" @click="changeMainImage(image)" />
            </div>
          </div>
        </div>
      </div>

      <div class="header-container">
        <h2>{{ product.name }}</h2>
        <p><strong>Category:</strong> {{ product.category?.name || 'N/A' }}</p>

        <div class="item-container">
          <div
            v-for="item in product.product_items"
            :key="item.id"
            class="item"
            :class="{ disabled: item.quantity === 0 }"
            @click="selectProductItem(item)"
          >
            <img :src="url + item.image" :alt="item.name" />
            <p>{{ item.name }}</p>
            <span>{{ item.price.toLocaleString() }} Ks.</span>
            <input type="hidden" :id="'quantity-' + item.id" :value="item.quantity" />

            <span v-if="item.quantity === 0" class="out-of-stock">Out of Stock</span>
          </div>
        </div>

        <div class="highlight-container">
          <h3>Highlight</h3>
          <p v-html="product.highlight"></p>
        </div>

        <div class="quantity-wrapper" v-if="selectedItem">
          <button type="button" class="quantity-decrease" @click="quantity = Math.max(1, quantity - 1)">-</button>
          <input type="number" v-model="quantity" min="1" :max="maxQuantity" class="quantity-input" />
          <button type="button" class="quantity-increase" @click="quantity = Math.min(maxQuantity, quantity + 1)">+</button>
        </div>

        <div class="action-container">
          <button class="add-to-cart" @click="toggleCart">
            <ion-icon name="cart-outline"></ion-icon>
            <span class="cart-button-text">{{ isInCart ? "Remove from Cart" : "Add to Cart" }}</span>
            <span class="product-cart-count">{{ cartCounts[product.id] || 0 }}</span>
          </button>

          <button class="buy-now-btn" @click="buyNow">Buy Now!</button>
        </div>
      </div>
    </div>

    <div class="description-container">
      <h3>Description</h3>
      <p v-html="product.description"></p>
    </div>
  </div>

  <!-- Skeleton Loading -->
  <div v-else class="container">
    <Skeleton width="100%" height="300px" />
    <Skeleton width="60%" height="20px" style="margin-top: 20px" />
    <Skeleton width="40%" height="20px" style="margin-top: 10px" />
    <Skeleton width="100%" height="50px" style="margin-top: 30px" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import {axiosAPI} from "@/stores/axios";
import Skeleton from "@/components/Skeleton.vue";

const props = defineProps({
  id: [String, Number],
});

console.log("Product ID:", props.id);
const product = ref(null);
const selectedImage = ref("");
const selectedItem = ref(null);
const cartCounts = ref({});
const isInCart = ref(false);
const quantity = ref(1);
const loading = ref(true);
const url = "http://127.0.0.1:8000/storage/";

const fetchData = async (id) => {
  loading.value = true;
  try {
    const response = await axiosAPI.get(`/api/products/${id}`);
    if (response.data.success) {
      product.value = response.data.data;
      selectedImage.value = url + product.value.image_1 || "";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData(props.id);
});

watch(() => props.id, (newId) => {
  fetchData(newId);
});

const maxQuantity = computed(() => selectedItem.value?.quantity || 1);

const imageFields = computed(() => {
  const imageFieldsArray = [
    url + product.value?.image_1,
    url + product.value?.image_2,
    url + product.value?.image_3,
    url + product.value?.image_4,
    url + product.value?.image_5,
    url + product.value?.image_6,
  ];
  return imageFieldsArray.filter(Boolean);
});

const changeMainImage = (image) => {
  selectedImage.value = image;
};

const selectProductItem = (item) => {
  selectedItem.value = item;
  selectedImage.value = url + item.image;
};

const toggleCart = async () => {
  if (!product.value || !selectedItem.value) return;
  try {
    const response = await axiosAPI.post("/api/cart/toggle", {
      product_item_id: selectedItem.value?.id,
    });
    isInCart.value = response.data.in_cart;
    cartCounts.value[product.value.id] = response.data.cart_count;
  } catch (error) {
    console.error("Error updating cart:", error);
  }
};

const buyNow = async () => {
  try {
    await axiosAPI.post("/api/products/buyNow", {
      product_id: product.value.id,
      product_item_id: selectedItem.value?.id,
      quantity: quantity.value,
    });
    alert("Purchase successful!");
  } catch (error) {
    console.error("Error buying product:", error);
  }
};
</script>

<style scoped>
/* ============================== */
/* Global Styles */
/* ============================== */
body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #333;
}

/* ============================== */
/* Container Layout */
/* ============================== */
.container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background: #ffffff;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

/* ============================== */
/* Back Icon */
/* ============================== */
.back-icon {
    font-size: 32px;
    cursor: pointer;
    color: var(--primary);
    transition: color 0.3s;
}

.back-icon:hover {
    color: var(--primary);
}

/* ============================== */
/* Product Layout */
/* ============================== */
.product-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* ============================== */
/* Image Section */
/* ============================== */
.image-container {
    flex: 1;
    max-width: 500px;
}

.main-img-container img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.row-image-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.row-image img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out, opacity 0.3s;
}

.row-image img:hover {
    transform: scale(1.1);
    opacity: 0.8;
}

/* ============================== */
/* Product Details */
/* ============================== */
.header-container {
    flex: 1;
    padding: 20px;
}

.header-container h2 {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.header-container p {
    font-size: 16px;
    color: #555;
}

/* ============================== */
/* Product Item Selection */
/* ============================== */
.item-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
}

.item {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    width: 120px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item:hover {
    background: #e0e0e0;
}

.item.selected {
    background: var(--primary);
    color: white;
}

.item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
}

.item p {
    font-size: 14px;
    margin: 5px 0;
}

.item span {
    font-weight: bold;
}

.item .out-of-stock {
    display: block;
    color: red;
    font-size: 12px;
}

/* ============================== */
/* Highlight Section */
/* ============================== */
.highlight-container {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.highlight-container h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

/* ============================== */
/* Quantity Selector */
/* ============================== */
.quantity-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.quantity-wrapper button {
    background: var(--primary);
    border: none;
    padding: 5px 10px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
}

.quantity-wrapper button:hover {
    opacity: 0.5;
}

.quantity-input {
    width: 50px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* ============================== */
/* Action Buttons (Cart & Buy) */
/* ============================== */
.action-container {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.add-to-cart, .buy-now-btn {
    background: var(--primary);
    border: none;
    padding: 12px 20px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.3s;
}

.add-to-cart:hover, .buy-now-btn:hover {
    opacity: 0.5;
}

.add-to-cart ion-icon, .buy-now-btn ion-icon {
    font-size: 20px;
}

.cart-button-text {
    font-size: 14px;
}

/* ============================== */
/* Description Section */
/* ============================== */
.description-container {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.description-container h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #333;
}

/* ============================== */
/* Responsive Design */
/* ============================== */
@media (max-width: 768px) {
    .product-container {
        flex-direction: column;
    }

    .item-container {
        justify-content: center;
    }

    .image-container {
        max-width: 100%;
    }

    .action-container {
        flex-direction: column;
        align-items: center;
    }

    .add-to-cart, .buy-now-btn {
        width: 100%;
        text-align: center;
    }
}
</style>