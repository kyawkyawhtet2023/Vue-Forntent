<template>
  <div class="container">
    <!-- Skeleton Loader while products are loading -->
    <template v-if="loading">
      <div
        v-for="n in 18"
        :key="'skeleton-' + n"
        class="product-container"
      >
        <div class="image-container">
          <Skeleton width="100%" height="200px" />
        </div>
        <div class="name">
          <Skeleton width="100%" height="20px" />
        </div>
        <div class="price-cart-container">
          <div class="price-container">
            <Skeleton width="80px" height="20px" />
          </div>
          <div class="cart-container">
            <Skeleton width="30px" height="30px" />
          </div>
        </div>
      </div>
    </template>

    <!-- Actual Product List -->
    <template v-else>
      <div
        v-for="product in products"
        :key="product.id"
        class="product-container"
      >
        <router-link
          :to="{ name: 'ShowProduct', params: { id: product.id } }"
        >
          <div class="image-container">
            <img :src="product.image_1" alt="Product Image" />
          </div>
          <p class="name">{{ product.name }}</p>
        </router-link>

        <div class="price-cart-container">
          <div
            class="price-container"
            v-if="product.product_items.length > 0"
          >
            <p>{{ product.product_items[0].price.toLocaleString() }} Ks.</p>
          </div>

          <div class="cart-container">
            <div
              @click="toggleCart(product)"
              :class="{ disabled: product.isLoading }"
            >
              <ion-icon
                :style="{ opacity: product.isLoading ? 0.5 : 1 }"
                :name="isInCart(product) ? 'cart' : 'cart-outline'"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useProductList } from "@/composables/ProductList";
import Skeleton from "@/components/Skeleton.vue";

const {
  products,
  isInCart,
  toggleCart,
  init,
  cleanup
} = useProductList();

const loading = ref(true);

onMounted(async () => {
  init();
  loading.value = false;
});

onBeforeUnmount(cleanup);
</script>




<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.product-container {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 8px;
  text-align: center;
  position: relative;
}
.image-container img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
}
.name {
  font-size: 14px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.9);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 5px 0;
}
.price-cart-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-container {
  font-size: medium;
  font-weight: 600;
  color: var(--primary);
}
.cart-container ion-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary);
}
.cart-container:hover ion-icon {
  animation: shake 0.5s ease-in-out;
}
</style>
