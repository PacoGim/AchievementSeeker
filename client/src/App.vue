<template>
  <App id="app" flex="column-dir">
    <fancy-bg />
    <Navbar />
    <route-name flex="justify-center align-center">{{this.$store.get('currentRoute')}}</route-name>
    <router-view />
  </App>
</template>


<style>
@import "assets/main.scss";

App {
  /* display: grid; */
  /* grid-template-columns: 70px auto; */
  /* height: 100vh; */

  /* background: linear-gradient(to bottom right, #0c8ef2, #192ee9); */
  /* height: 50vh; */
}

fancy-bg {
  display: block;
  height: 50vh;
  width: 100vw;
  position: absolute;
  top: 0;
  background: var(--fancy-bg-color);
  z-index: -1;
  transform: skewY(-2.5deg) translateY(-45px);
  box-shadow: 0 0 5px 2.5px rgba(0, 0, 0, 0.25);
}

route-name {
  height: 33vh;
  color: #fff;
  font-weight: 600;
  font-size: 3.5rem;
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