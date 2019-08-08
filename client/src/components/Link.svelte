<script>
  import { onMount } from "svelte";
  import { router } from "store/store.js";
  import { setFancyBG } from "helpers/fancyBG.js";

  export let to;
  export let id;
  export let rel;
  export let name = undefined;
  export let active = undefined;
  export let useClass = undefined;
  export let loadFancyBG = undefined;
  let currentEl;

  onMount(() => {
    currentEl = document.querySelector(`#${id}`);

    if (name === document.title) {
      preRouting();
    }
  });

  function preRouting() {
    router.setRouteActive(name);
    setFancyBG(id);
  }
</script>

<style>
  a.navbar-link {
    display: inline;
    font-size: 1.1rem;
    color: #fff;
    text-decoration: none;
    font-weight: 400;
    padding: 0.5rem;
    padding-bottom: 0.2rem;
    margin: 0 0.5rem;
    border-bottom: 2px solid transparent;

    transition: font-weight 0.3s, border-bottom 1s;
  }
  a.navbar-link:hover {
    font-weight: 600;
  }

  a.navbar-link[active="true"] {
    font-weight: 600;
    border-bottom: 2px solid #fff;
  }
</style>

<a {id} class={useClass} href={to} {active} on:click={() => preRouting()}>
  <slot />
</a>
