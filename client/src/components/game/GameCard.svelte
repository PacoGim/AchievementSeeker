<script>
  import { onMount } from "svelte";

  import {
    supportsWebp,
    fetchImageBase64,
    fetchImageArrayBuffer
  } from "helpers/functions.js";

  export let name;
  export let _id;
  export let _v;
  export let difficulty;
  export let platforms;
  export let genres;
  export let popularity;
  export let isFree;
  export let releaseDate;
  export let appid;
  export let score;
  export let points;
  export let totalAchievements;
  export let index;

  let isImageLoading = true;
  let imageSrc = "";

  onMount(async () => {
    if (window.supportsWebp === undefined) {
      await supportsWebp();
    }

    if (window.supportsWebp) {
      fetchImageBase64(`http://localhost:443/games/header/${_id}`).then(
        imageUrl => {
          imageSrc = imageUrl;
          isImageLoading = false;
        }
      );
    } else {
      fetchImageArrayBuffer(
        `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
      ).then(imageUrl => {
        imageSrc = imageUrl;
        isImageLoading = false;
      });
    }
  });
</script>

<style>
  game-card {
    padding: 1rem;
    margin: 1rem;
    background-color: #fff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }

  a {
    width: 256px;
    height: 15rem;
  }

  img {
    display: block;
    height: 120px;
    margin: 0 auto;
  }
</style>

<game-card flex="direction-col">
  <a href="/game/{_id}">

    {#if isImageLoading}
      <img src="icons/puff.svg" alt="" />
    {:else}
      <img src={imageSrc} alt="" />
    {/if}
    <p>{name}</p>
    <p>{index + 1}</p>
  </a>
</game-card>
