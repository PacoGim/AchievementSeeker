<script>
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  import { setFancyBG } from "helpers/fancyBG.js";

  import { supportsWebp } from "helpers/functions.js";

  import { currentRoute, isDay } from "store/store.js";

  import Nav from "components/Nav.svelte";
  import FancyBG from "components/FancyBG.svelte";

  onMount(async () => {
    if (window.supportsWebp === undefined) {
      await supportsWebp();
    }
  });

  let isDayBoolean;

  isDay.subscribe(value => (isDayBoolean = value));
</script>

<style>
  route-name {
    height: 40vh;
    font-size: 3rem;
    font-weight: 600;
  }

  app {
    display: block;
    min-height: 100vh;
  }

  day-night {
    position: fixed;
    display: block;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: #fff;
    mix-blend-mode: difference;
    z-index: 999;
    pointer-events: none;

    opacity: 1;

    transition: opacity 1s;
  }

  day-night[isDay="true"] {
    opacity: 0;
  }
</style>

<app>
  <day-night isDay={isDayBoolean} />
  <Nav />
  <FancyBG />
  <route-name flex="justify-center align-center"  transition:fly={{y:300}}>{$currentRoute}</route-name>
  <slot />
</app>
