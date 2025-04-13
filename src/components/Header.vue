<template>
  <div class="header-container">
   
    <div class="profile-container">
      <div class="image-container">
        <RouterLink :to="{name:'home'}">
          <img v-if="image" :src="image" alt="Profile Image" />
          <div v-else >
            <Skeleton type="circle" width="35px" height="35px" border-radius="100%" />
          </div>
          
         
        </RouterLink>
        
      </div>
      <div class="name-container"> 
        <h2 v-if="name">{{ name }}</h2>
        <div v-else class="loading">
          <Skeleton width="100px" height="30px" />
        </div>  
      </div>
    </div>
    
    <div class="search-container">
        <input type="search" placeholder="search products..." />
        <ion-icon name="search-sharp" class="search-icon"></ion-icon> 
    </div>

    <div>
      <div class="header-nva">
        <RouterLink :to="{name:'cart'}" class="cart-container">    
            <ion-icon name="cart" class="cart"></ion-icon>
            <span class="cart-span">{{ user ? cartStore.count : 0 }}</span>

        </RouterLink>
      </div>
    </div>

    <div>
      <nav class="header-nva">     
        <router-link to="/">Home</router-link> 
        <router-link :to="{name:'Order'}">Order</router-link>
      </nav>
    </div>

    <div class="menu-container">
      <ion-icon name="menu" class="menu-icon" @click="$emit('toggle-menu')"></ion-icon>

    </div>
  </div>  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from "@/composables/user";
import Skeleton from '@/components/Skeleton.vue';

const { user } = useAuth(); // user is a ref
  
  // Assuming useAuth returns an object with a user property
    const name = ref('');
    const image = ref('');
    const cartStore = useCartStore();


    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile');
        const result = await response.json();

        if (result.success && result.data) { 
          name.value = result.data.name || 'No Name';
          image.value = result.data.image || ''; 
        
        } else {
          console.warn("Profile data is missing:", result);
        }

        console.log("Fetched Data:", result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    onMounted(() => {
    cartStore.fetchCartCount();
    fetchData();
});

    
</script>

<style scoped>
.header-container {
  display: flex;
  gap: 5px;
  width: 98%;
  margin: 0%;
  padding: 1% 3px;
  justify-content: space-between;
  align-items: center;
  line-height: 0%;
  background-color: white;
  border-bottom: 0.7px solid beige;
}

.profile-container {
  display: flex;
  gap: 5px;
  cursor: pointer;
  text-decoration: none;
}

.image-container {
  width: 35px;
  height: 35px;
  font-size: small;
}

.image-container img {
  width: 35px;
  height: 35px;
}

.name-container {
  font-size: medium;
}

.name-container h2 {
  font-size: 1.5rem; /* Adjust size as needed */
  font-weight: 800;
  color:var(--primary); /* Change to your preferred color */
  letter-spacing: 1px; /* Improves readability */
}


.search-container{
  display: flex;
  width:40%;
  border-radius: 10px;
  border: 1px solid var(--primary);
  align-items: center;
}
.search-container input{
  border:none;
  outline: none;
  width:95%;
  padding:5px 10px;
  border-radius: 15px;
  font-size: medium;
  font-weight: 300;
  color:rgba(38, 38, 38, 0.914);
  cursor: pointer;
  

}
.search-container:focus-within {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.search-container .search-icon{
  margin:auto;
  margin-right: 5px;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  font-weight: bolder;
  font-size: 20px;
  color:var(--primary);
}
.search-container .search-icon:hover {
  animation: shake 0.3s ease-in-out infinite;
}
.header-nva{
  line-height: 0%;
}
.cart-container{
  position: relative;
  margin: auto;
  padding:0%;
}
.cart-container .cart{
  font-size: 2rem;
  line-height: 0%;
  margin: auto;
  padding: 0%;
}
.cart-container .cart:hover{
  animation: shake 0.3s ease-in-out infinite;
}
.cart-container span {
  position: absolute;
  top: 0;
  right: 0;
  font-size: x-small;
  background-color: rgb(214, 30, 30);
  color: white;
  width: 10px;  /* Adjust as needed */
  height: 10px; /* Same as width for a circle */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold; /* Makes number inside clearer */
}
.menu-container .menu-icon{
  font-size: 2rem;
  color:var(--primary);
  cursor: pointer;
}




</style>
