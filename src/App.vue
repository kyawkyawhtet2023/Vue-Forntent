<template>
  <div class="app-container">
    <Header @toggle-menu="menuvisible = !menuvisible"></Header>

    <div class="menu-div">
      <HeaderMenu  :menuvisible="menuvisible" @toggle-menu="menuvisible = !menuvisible"></HeaderMenu>
    </div>

    <div class="routerView-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from './components/Header.vue';
import HeaderMenu from './components/HeaderMenu.vue';

export default {
  components: {
    Header,
    HeaderMenu,
  },

  setup() {
    const menuvisible = ref(false);

    return {
      menuvisible
    };
  }
};

</script>

<style>
.menu-div {
  position: relative;
}
</style>
