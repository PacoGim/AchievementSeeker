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

  let counter = 0;
  let gameListTranslate = 74;

  function moveContainer(direction) {
    let rectanglesWidth =
      document.querySelector("rectangles").offsetWidth - 74 * 2;
    let gameCardWidth = document.querySelector("game-card").offsetWidth;

    let foo = Math.floor(rectanglesWidth / gameCardWidth);

    if (direction === "left") {
      counter++;
      gameListTranslate =
        -gameCardWidth * foo * counter - 32 * foo * counter + 74;
    } else {
      if (gameListTranslate >= 74) {
        gameListTranslate = 74;
      } else {
        counter--;
        gameListTranslate =
          -gameCardWidth * foo * counter - 32 * foo * counter + 74;
      }
    }
  }
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

  rectangle img {
    transition: transform 0.3s;
  }

  rectangle[num="1"] {
    box-shadow: 4px 0px 3px 0px rgba(0, 0, 0, 0.25);
  }

  rectangle[num="1"]:hover img {
    transform: translateX(-8px);
  }
  rectangle[num="2"] {
    box-shadow: -4px 0px 3px 0px rgba(0, 0, 0, 0.25);
  }

  rectangle[num="2"]:hover img {
    transform: translateX(8px);
  }

  container {
    position: absolute;

    transition: transform 0.5s;
  }
</style>

<list>

  <description>Most Popular Games:</description>
  <section>
    <rectangles flex="justify-between">
      <rectangle
        cursor="pointer"
        flex="jusify-center align-center"
        num="1"
        on:click={() => moveContainer('right')}>
        <img icon="fit-width" src="icons/arrow-back.svg" alt="" />
      </rectangle>
      <rectangle
        cursor="pointer"
        flex="jusify-center align-center"
        num="2"
        on:click={() => moveContainer('left')}>
        <img icon="fit-width" src="icons/arrow-forward.svg" alt="" />
      </rectangle>
    </rectangles>
    <container
      flex="direction-row"
      style="transform:translateX({gameListTranslate}px)">
      {#each games as game, index}
        <GameCard {game} {index} />
      {/each}
    </container>
  </section>

</list>

<svelte:head>
  <title>Game List</title>
</svelte:head>
