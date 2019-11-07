<script>
  import { onMount } from "svelte";

  import { isWebpSupported } from "services/helper.service.js"

  import { router } from "store/store.js";

  import Navbar from "components/Navbar.svelte";
  import FancyBG from "components/FancyBG.svelte";

  onMount(async () => {
    if (window.isWebpSupported === undefined) {
      await isWebpSupported();
    }
  });
</script>

<style lang="scss" global>
  @import "assets/styles/global.scss";

  route-name {
    height: 40vh;
    font-size: 3rem;
    font-weight: 600;

    transition: opacity, transform cubic-bezier(0, 0, 0, 2);
    transition-duration: 0.5s;
  }

  app {
    display: block;
    min-height: 100vh;
  }
</style>

<app>
  <Navbar />
  <FancyBG />
  <route-name flex="justify-center align-center">
    {$router['currentRoute']}
  </route-name>
  <slot />
</app>
