<script>
  import { onMount } from "svelte";

  // import { currentRoute } from "store/store.js";

  import Link from "components/Link.svelte";

  import {
    isWebpSupported,
    fetchImageBase64,
    fetchImageArrayBuffer
  } from "helpers/functions.js";

  export let game;
  export let index;

  let isImageLoading = true;
  let imageSrc = "";

  onMount(async () => {
    if (window.isWebpSupported === undefined) {
      await isWebpSupported();
    }

    // fetchImageArrayBuffer(
    //   window.isWebpSupported
    //     ? `http://localhost:443/games/header/${game["_id"]}`
    //     : `https://steamcdn-a.akamaihd.net/steam/apps/${game["appid"]}/header.jpg`
    // ).then(imageUrl => {
    //   imageSrc = imageUrl;
    //   isImageLoading = false;
    // });
  });
</script>

<style>
  game-card {
    padding: 1rem;
    margin: 1rem;
    background-color: #fff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }

  img {
    display: block;
    height: 120px;
    margin: 0 auto;
    min-width: 256.75px;
  }
</style>

<game-card flex="direction-col">
  <Link rel="prefetch" id="game-link-{game['_id']}" to="/game/{game['_id']}">
    <picture>
      <source
        srcset="http://localhost:4000/images/header/{game._id}"
        type="image/webp" />
      <img
        src="https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/header.jpg"
        alt={game.name} />
    </picture>
    <p>{game['name']}</p>
    <p>{index + 1}</p>
  </Link>
</game-card>
