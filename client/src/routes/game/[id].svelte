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

  import {
    supportsWebp,
    fetchImageBase64,
    fetchImageArrayBuffer
  } from "helpers/functions.js";

  export let game;
  let background;
  let opacity = 0;

  onMount(async () => {
    currentRoute.set(game["name"]);
    setGameFancyBG();

    if (window.supportsWebp === undefined) {
      await supportsWebp();
    }

    if (window.supportsWebp) {
      fetchImageBase64(
        `http://localhost:443/games/background/${game["_id"]}`
      ).then(imageUrl => {
        background = imageUrl;
        opacity = 1;
      });
    } else {
      fetchImageArrayBuffer(
        `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
      ).then(imageUrl => {
        imageSrc = imageUrl;
      });
    }
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
</style>

<svelte:head>
  <title>{game['name']}</title>
</svelte:head>

<game>
  <background-image
    style="background-image:url({background}); opacity:{opacity}" />
  <h1>{game['name']}</h1>
</game>
