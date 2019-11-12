<script>
  import { onMount } from "svelte";

  import { fetchGameHeaderImage } from "services/fetch.service.js";
  import { isWebpSupported } from "services/helper.service.js";

  export let gameID;
  // export let gameAppid;
  // export let gameName;
  export let styleClass;
  let imageUrl;

  onMount(async () => {
    if (window.isWebpSupported === undefined) await isWebpSupported();

    fetchGameHeaderImage(gameID).then(imageData => (imageUrl = imageData));
  });
</script>

<style lang="scss">
  img {
    display: block;
  }

  img.game-card-header {
    height: 120px;
    min-width: 256.75px;
  }

  img.game-search-header {
    height: 45px;
  }
</style>

<img class={styleClass} src={imageUrl} alt="" />
