<script>
  import { onMount } from "svelte";
  import { setFancyBG } from "helpers/fancyBG.js";

  import { currentRoute } from "store/store.js";

  import Nav from "components/Nav.svelte";
  import FancyBG from "components/FancyBG.svelte";

  let routeName = "";

  currentRoute.subscribe(value => {
    routeName = value;
  });
</script>

<style>
  day-night {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    mix-blend-mode: difference;
  }
  route-name {
    height: 40vh;
    font-size: 3rem;
    font-weight: 500;
  }

  app {
    display: block;
    min-height: 100vh;
  }
</style>

<app>
  <day-night>Day/Night</day-night>
  <Nav />
  <FancyBG />
  <route-name flex="justify-center align-center">{routeName}</route-name>
  <slot />
</app>
