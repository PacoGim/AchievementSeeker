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

  import Achievement from "components/game/Achievement.svelte";

  export let game;
  let background;
  let logoUrl = undefined;
  let opacity = 0;
  let rotateY = 540;

  onMount(async () => {
    setGameFancyBG();

    getGameBackground(game["_id"], game["appid"], game["backgrounds"]).then(
      res => {
        background = res;
        opacity = 1;
      }
    );

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
    font-size: 3rem;
    font-weight: 600;
  }
</style>

<svelte:head>
  <title>{game['name']}</title>
</svelte:head>

<game>
  <background-image
    style="background-image:url({background}); opacity:{opacity}" />
  <logo flex="justify-center align-center">
    <picture>
      <source
        srcset="http://localhost:443/server/public/images/{game._id}/logos/logo.webp"
        type="image/webp" />
      <source
        srcset="http://localhost:443/server/public/images/{game._id}/logos/logo.png"
        type="image/png" />
      <img src="" alt={game.name} />
    </picture>
  </logo>
  <achievements>
    <h1>Achievements</h1>

    {#each game['achievements'] as achievement, index}
      <Achievement {achievement} gameName={game['name']} appid={game['appid']} {index} gameId={game['_id']} />
    {/each}

  </achievements>
</game>
