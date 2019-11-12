<script>
  import { onMount } from "svelte";

  import Link from "components/Link.svelte";
  import GameHeader from "components/game/GameHeader.svelte";

  export let game;
  export let index;

  let isImageLoading = true;
  let imageSrc = "";
</script>

<style lang="scss">
  game-card {
    padding: 1rem;
    margin: 1rem;
    background-color: #fff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }
</style>

<game-card flex="direction-col">
  <Link rel="prefetch" id="game-link-{game['_id']}" to="/game/{game['_id']}">
    <GameHeader styleClass="game-card-header" gameID={game['_id']} />
    <p>{game['name']}</p>
    <p>{index + 1}</p>
  </Link>
</game-card>
