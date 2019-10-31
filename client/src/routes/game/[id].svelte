<script context="module">
  import { getGame } from "services/graphql.service.js";
  export async function preload({ params, query }) {
    // const res = await this.fetch(`http://localhost:443/games/${params["id"]}`);

    // let data = await res.json();

    // if (res.status === 404) {
    //   return this.redirect(404, "Error 404");
    // } else {
    //   return { game: data };
    // }

    let game = await getGame({ id: params["id"] });
    return { game };
  }
</script>

<script>
  import { onMount } from "svelte";

  import {
    getGameBackground,
    getGameLogo,
    getSafeFolderName
  } from "helpers/game.helper.js";

  import Achievement from "components/game/Achievement.svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  export let game;

  const componentName = game["name"];
  let background;
  let logoUrl = undefined;
  let opacity = 0;
  let rotateY = 540;
  let logoLoaded = false;

  onMount(async () => {
    setFancyBG(
      "#000",
      "#000",
      "skewY(0deg) translateY(-50vh)",
      "skewY(0deg) translateY(-50vh)",
      0.1
    );

    // getGameBackground(game["_id"], game["appid"], game["backgrounds"]).then(
    //   res => {
    //     background = res;
    //     opacity = 1;
    //   }
    // );

    // getGameLogo(game["_id"])
    //   .then(res => {
    //     rotateY = 0;
    //     logoUrl = res;
    //   })
    //   .catch(err => {
    //     logoUrl = null;
    //     console.log(err);
    //   });
  });
</script>

<style>
  game upper background logo {
    opacity: 0;
    transition: opacity 1s;
  }

  game upper background logo[logoLoaded="true"] {
    opacity: 1;
  }
</style>

<svelte:head>
  <title>{componentName}</title>
</svelte:head>

<game>
  <upper>
    <background>
      <logo flex="justify-center align-center" {logoLoaded}>
        <picture>
          <source
            srcset="http://localhost:4000/images/{getSafeFolderName(game._id, game.name)}/logos/logo.webp"
            type="image/webp" />
          <source
            srcset="http://localhost:4000/images/{getSafeFolderName(game._id, game.name)}/logos/logo.png"
            type="image/png" />
          <img src="" onload={(logoLoaded = true)} alt={game.name} />
        </picture>
      </logo>
      <art />
    </background>
    <game-details />
  </upper>
  <!-- <background-image
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
  </logo> -->
  <!-- <achievements>
    <h1>Achievements</h1>

    {#each game['achievements'] as achievement, index}
      <Achievement
        {achievement}
        gameName={game['name']}
        appid={game['appid']}
        {index}
        gameId={game['_id']} />
    {/each}

  </achievements> -->
</game>
