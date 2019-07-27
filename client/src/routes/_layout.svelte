<script>
  import { onMount } from "svelte";
  import { setFancyBG } from "helpers/fancyBG.js";

  import { currentRoute } from "store/store.js";

  import Nav from "components/Nav.svelte";
  import FancyBG from "components/FancyBG.svelte";

  let routeName = "";

  const unsubcribe = currentRoute.subscribe(value => {
    routeName = value;
  });
</script>

<app>
  <Nav />
  <FancyBG />
  <route-name>{routeName}</route-name>
  <slot />
</app>
