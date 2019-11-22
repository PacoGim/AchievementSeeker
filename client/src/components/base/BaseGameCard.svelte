<script>
  import { onMount } from "svelte";

  import BaseLink from "components/base/BaseLink.svelte";
  import BaseGameHeader from "components/base/BaseGameHeader.svelte";

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
  <BaseLink rel="prefetch" id="game-link-{game['_id']}" to="/game/{game['_id']}">
    <BaseGameHeader styleClass="game-card-header" gameID={game['_id']} />
    <p>{game['name']}</p>
    <p>{index + 1}</p>
  </BaseLink>
</game-card>
