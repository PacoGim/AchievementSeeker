<script>
  import { onMount } from "svelte";

  import { setFancyBG } from "helpers/fancyBG.js";

  import { isWebpSupported } from "helpers/functions.js";

  import { currentRoute } from "store/store.js";

  import Navbar from "components/Navbar.svelte";
  import FancyBG from "components/FancyBG.svelte";

  onMount(async () => {
    if (window.isWebpSupported === undefined) {
      await isWebpSupported();
    }
  });
</script>

<style>
  route-name {
    height: 40vh;
    font-size: 3rem;
    font-weight: 600;

    transition: opacity .5s;
  }

  app {
    display: block;
    min-height: 100vh;
  }
</style>

<app>
  <Navbar />
  <FancyBG />
  <route-name flex="justify-center align-center">{$currentRoute}</route-name>
  <slot />
</app>
