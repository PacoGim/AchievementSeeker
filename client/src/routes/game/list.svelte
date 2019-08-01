<script context="module">
  export async function preload({ params, query }) {
    const res = await this.fetch(`http://localhost:443/games/customGames`, {
      method: "POST",
      body: JSON.stringify({
        project: {
          name: 1,
          _id: 1,
          _v: 1,
          difficulty: 1,
          platforms: 1,
          genres: 1,
          popularity: 1,
          isFree: 1,
          releaseDate: 1,
          appid: 1,
          score: 1,
          points: 1,
          totalAchievements: 1
        },
        sort: {
          "popularity.count": -1
        }
      })
    });

    return { games: await res.json() };
  }
</script>

<script>
  import GameCard from "components/game/GameCard.svelte";
  import { onMount } from "svelte";

  export let games;
</script>

<style>
  section {
    margin-top: 2rem;
    width: 100vw;
    position: relative;
  }

  description {
    padding: 0.5rem 1rem;
    background-color: #000;
    font-size: 1.5rem;
    font-weight: 700;
    margin-left: 2rem;
  }

  rectangles {
    position: absolute;
    width: 100vw;
  }
  rectangle {
    background-color: #fff;
    height: 20rem;
    width: 4rem;
    z-index: 1;
  }

  rectangle[num="1"] {
    box-shadow: 4px 0px 3px 0px rgba(0, 0, 0, 0.25);
  }

  rectangle[num="2"] {
    box-shadow: -4px 0px 3px 0px rgba(0, 0, 0, 0.25);
  }

  container {
    position: absolute;

    transform: translateX(74px);
  }
</style>

<list>

  <description>Most Popular Games:</description>
  <section>
    <rectangles flex="justify-between">
      <rectangle num="1" />
      <rectangle num="2" />
    </rectangles>
    <container flex="direction-row">
      {#each games as game,index (game['_id'])}
        <GameCard {...game} {index} />
      {/each}
    </container>
  </section>

</list>

<svelte:head>
  <title>Game List</title>
</svelte:head>
