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

  import { getGameBackground, getGameLogo } from "helpers/game.helper.js";

  export let game;
  let background;
  let logoUrl = undefined;
  let opacity = 0;
  let rotateY = 540;

  onMount(async () => {
    setGameFancyBG();

    getGameBackground(game["_id"]).then(res => {
      background = res;
      opacity = 1;
    });

    getGameLogo(game["_id"])
      .then(res => {
        rotateY = 0;
        logoUrl = res;
      })
      .catch(err => {
        logoUrl = null;
        console.log(err);
      });
  });
</script>

<style>
  background-image {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    z-index: -3;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    transition: opacity 1s;
  }

  name {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 50vh;
    font-size: 4rem;
    font-weight: 750;
  }

  logo {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 50vh;
  }

  logo img {
    transition: transform 1s;
  }
</style>

<svelte:head>
  <title>{game['name']}</title>
</svelte:head>

<game>
  <background-image
    style="background-image:url({background}); opacity:{opacity}" />
  <logo flex="justify-center align-center">
    <img style="transform:rotateY({rotateY}deg)" src={logoUrl} alt="" />
  </logo>
  {#if logoUrl === null}
    <name flex="justify-center align-center">{game['name']}</name>
  {/if}
</game>
