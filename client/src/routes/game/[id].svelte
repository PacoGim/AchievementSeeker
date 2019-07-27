<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`http://localhost:443/games/${params["id"]}`);
    const data = await res.json();

    return { game: data };
  }
</script>

<script>
  import { onMount } from "svelte";

  import { currentRoute } from "store/store.js";

  export let game;

  onMount(() => {
    currentRoute.set(game['name']);
  });
</script>

<svelte:head>
  <title>{game['name']}</title>
</svelte:head>

<game>
  <h1>{game['name']}</h1>
</game>
