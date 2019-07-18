<template>
  <Navbar>
    <Desktop flex>
      <router-link :to="route.to" :key="index" v-for="(route,index) of routes">{{route['text']}}</router-link>
    </Desktop>
  </Navbar>
</template>

<script>
import { value } from "vue-function-api";

export default {
  setup() {
    const routes = value([
      {
        to: "/",
        text: "Home"
      },
      {
        to: "/game/list",
        text: "List"
      },
      {
        to: "/game/search",
        text: "Search Game"
      },
      {
        to: "/game/334Jvxn4145",
        text: "Half-Life 2"
      }
    ]);

    return {
      routes
    };
  }
};
</script>

<style lang="scss" scoped>
Navbar {
  Desktop {
    position: fixed;
    top: 0;
    width: 100vw;
    justify-content: flex-end;

    a {
      color: #fff;
      text-decoration: none;
      font-weight: 300;
      padding: 0.5rem;
      padding-bottom: 0.2rem;
      margin: 0 0.5rem;
      border-bottom: 2px solid transparent;

      transition: font-weight 0.3s, border-bottom 1s;
    }

    a:hover {
      font-weight: 600;
    }

    a.router-link-exact-active {
      font-weight: 600;
      // text-decoration: underline;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
