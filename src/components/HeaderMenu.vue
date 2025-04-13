<template>
    <div :class="['menu-container', { 'visible': menuvisible }]">
        <ion-icon name="close-circle" @click="$emit('toggle-menu')" class="close-icon"></ion-icon>
        <div>
            <img v-if="user" :src="user.image"/> 
            
            <h3>{{ user?.name }}</h3>
        </div>
        <div class="routerList">
            <router-link :to="{name:'Order'}" @click="$emit('toggle-menu')">Orders</router-link>
            <router-link :to="{name:'setting'}" @click="$emit('toggle-menu')"> Setting</router-link>
            <router-link :to="{name:'help'}" @click="$emit('toggle-menu')"> Help</router-link>
            <router-link :to="{name:'policy'}" @click="$emit('toggle-menu')"> Policy</router-link>
            <router-link :to="{name:'service'}" @click="$emit('toggle-menu')"> Our Service</router-link>
        </div>
        <div class="btn-container">
            <button v-if="user"  @click="handleLogout"> Logout</button>
            <button v-else  @click="handleLogin" > Login</button>
        </div>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/user';
import { useRouter } from 'vue-router';



const router = useRouter();
const emit = defineEmits(['toggle-menu']);

const handleLogin = () => {
  login(); // your actual login logic
  emit('toggle-menu');
};

const props = defineProps({
    menuvisible: Boolean
});

const { user, logout } = useAuth();
const handleLogout=()=>{
    logout(); // your actual logout logic
    router.push('/login'); // redirect to login page
    emit('toggle-menu');
}


const login =()=>{
    router.push('/login')
}




</script>


<style scoped>
img{
    width:50px;
    height: 50px;
}
.menu-container {
    position: absolute;
    top: 20%;
    right: 5px; /* Keep a reference position */
    width: 20%;
    height: 83vh;
    background-color: var(--primary);
    border: 1px solid var(--secondary);
    transition: transform 0.5s ease-in-out;
    transform: translateX(110%); /* Initially off-screen (right) */
    z-index: 10;
    
}

.menu-container.visible {
    transform: translateX(0); /* Moves into view */
}


.close-icon{
    position: absolute;
    top:5px;
    right:5px;
}
.routerList{
    display: flex;
    flex-direction: column;
    gap:5px;
    padding-left: 10px;
    
}
a{
    text-decoration: none;
    color: var(--secondary);
}
a.router-link-exact-active,
a:hover{
    text-decoration: underline;
}
.btn-container{
    width: 100%;
    position: absolute;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

}
.btn-container button{
    color:var(--secondary);
    background-color: var(--primary);
    padding:5px 10px;
    border-color: var(--secondary);
    
}
@keyframes left{
    from{
        right:-20%;
    }
    to{
        right:0;
    }
}



</style>