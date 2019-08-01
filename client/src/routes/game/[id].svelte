<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`http://localhost:443/games/${params["id"]}`);

    let data = await res.json();

    if (res.status === 404) {
      return this.redirect(404, "Error 404");
    } else {
      return { game: data };
    }
  }
</script>

<script>
  import { onMount } from "svelte";

  import { currentRoute } from "store/store.js";

  import { setGameFancyBG } from "helpers/fancyBG.js";

  export let game;

  onMount(() => {
    currentRoute.set(game["name"]);
    setGameFancyBG()
  });
</script>

<svelte:head>
  <title>{game['name']}</title>
</svelte:head>

<game>
  <h1>{game['name']}</h1>
</game>
