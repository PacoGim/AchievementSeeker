<script>
  import { onMount } from "svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  import GameSearch from "components/game/GameSearch.svelte";

  const componentName = "Game List";

  onMount(() => {
    setFancyBG({
      color1: "#41295a",
      color2: "#2f0743",
      transform1: "skewY(-10deg) translateY(0)",
      transform2: "skewY(10deg) translateY(0)"
    });
  });
</script>

<game-list flex="direction-column align-center">
  <GameSearch />
</game-list>

<svelte:head>
  <title>{componentName}</title>
</svelte:head>
