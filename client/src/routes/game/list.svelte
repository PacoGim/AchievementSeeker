<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`http://localhost:443/games/list`, {
      method: "POST",
      body: JSON.stringify({
        sort: {
          "popularity.count": -1
        }
      })
    });

    return { games: await res.json() };
  }
</script>

<script>
  import { onMount } from "svelte";

  export let games;

  onMount(() => {
    console.log(games[0]);
  });
</script>

<style>
  p {
    color: #222;
  }

  /* section{

  } */

  section description{
    padding: 0.5rem 1rem;
    background-color: #000;
    font-size: 1.5rem;
    font-weight: 700;
    margin-left: 2rem;
  }
</style>

<list>

  <section>
    <description>Most Popular Games:</description>
    <!-- {#each games as game}
      <p>{game['name']} - {game['popularity']['count']}</p>
    {/each} -->
    <rectangle/>
    <rectangle/>
  </section>

</list>

<svelte:head>
  <title>Game List</title>
</svelte:head>
