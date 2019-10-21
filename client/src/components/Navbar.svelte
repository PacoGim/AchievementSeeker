<script>
  import { router } from "store/store.js";
  import Link from "components/Link.svelte";
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
  {#each $router as route}
    <Link to={route['to']} id={route['id']} rel={route['rel']} name={route['name']} isActive={route['isActive']}  useClass="navbar-link">
      {route['name']}
    </Link>
  {/each}
</navbar>
