<template>
  <App id="app">
    <Navbar />
    <router-view />
  </App>
</template>


<style>
@import "./assets/main.scss";

App {
  display: grid;
  grid-template-columns: 70px auto;
  height: 100vh;

  background: linear-gradient(to bottom right, #0c8ef2, #192ee9);
}
</style>

<script>
// import {} from 'vue-function-api'
import Navbar from "@/components/Navbar.vue";
export default {
  components: {
    Navbar
  }
};
</script>