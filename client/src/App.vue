<template>
  <App id="app" flex="column-dir">
    <fancy-bg num="1" />
    <fancy-bg num="2" />
    <TheNavbar />
    <route-name flex="justify-center align-center">{{this.$store.get('currentRoute')}}</route-name>
    <router-view />
  </App>
</template>


<script>
// import {} from 'vue-function-api'
import TheNavbar from "@/components/TheNavbar.vue";
export default {
  components: {
    TheNavbar
  }
};
</script>

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
  box-shadow: 0 0 5px 2.5px rgba(0, 0, 0, 0.25);
  transition: background-color 1s, transform 1s;
}

fancy-bg[num="1"] {
  background-color: var(--fancy-bg-color-1);
  transform: var(--transform-1);
  z-index: -1;
}

fancy-bg[num="2"] {
  background-color: var(--fancy-bg-color-2);
  transform: var(--transform-2);
  z-index: -2;
}

route-name {
  height: 45vh;
  color: #fff;
  font-weight: 600;
  font-size: 3.5rem;
}
</style>
