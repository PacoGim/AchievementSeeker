<script context="module">
  import { getGameListGames } from "services/graphql.service.js";
  export async function preload({ params, query }) {
    let games = await getGameListGames({
      sort: "{year:-1,month:-1,trend:-1}"
    });

    return { games };
  }
</script>

<script>
  import BaseGameCard from "components/base/BaseGameCard.svelte";

  import { onMount } from "svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  onMount(() => {
    setFancyBG({
      color1: "#4364f7",
      color2: "#6fb1fc",
      transform1: "skewY(-2.5deg) translateY(-45px)",
      transform2: "skewY(1deg)"
    });
  });

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

  <description>Trending Games:</description>
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
        <BaseGameCard {game} {index} />
      {/each}
    </container>
  </section>

</list>

<svelte:head>
  <title>Achievement Seeker</title>
</svelte:head>
