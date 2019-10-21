<script>
  import { onMount } from "svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  onMount(() => {
    setFancyBG(
      "#41295a",
      "#2f0743",
      "skewY(-5deg) translateY(-70px)",
      "skewY(20deg) translateY(-100px)"
    );
  });
</script>

<search>
  <h1>Search</h1>
</search>

<svelte:head>
  <title>Search Game</title>
</svelte:head>
