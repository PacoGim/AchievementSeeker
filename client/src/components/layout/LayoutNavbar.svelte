<script>
  import { router } from "store/store.js";
  import BaseLink from "components/base/BaseLink.svelte";
</script>

<style>
  navbar {
    position: fixed;
    top: 0;
    width: 100vw;
    padding-right: 1rem;
    height: 2rem;
    z-index: 1000;
  }
</style>

<navbar flex="justify-end align-center">
  {#each $router['routes'] as route}
    <BaseLink to={route['to']} id={route['id']} rel={route['rel']} name={route['name']} isActive={route['isActive']}  useClass="navbar-link">
      {route['name']}
    </BaseLink>
  {/each}
</navbar>
