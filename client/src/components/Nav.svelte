<script>
  import { onMount } from "svelte";
  import { setFancyBG } from "helpers/fancyBG.js";

  import { currentRoute } from "store/store.js";

  let routes = [
    {
      to: "/",
      name: "Home"
    },
    {
      to: "game/list",
      name: "Game List"
    },
    {
      to: "game/search",
      name: "Search Game"
    },
    {
      to: "game/334Jvxn4145",
      name: "Game"
    }
  ];

  onMount(() => {
    preRouting(document.title);
  });

  function preRouting(routeName) {
    currentRoute.set(routeName);
    setFancyBG(routeName);
    setActiveRoute(routeName);
  }

  function setActiveRoute(routeName) {
    routes.forEach(route => {
      route.name === routeName
        ? (route["active"] = true)
        : delete route["active"];
    });
    routes = routes;
  }
</script>

<style>
  nav {
    position: fixed;
    top: 0;
    width: 100vw;
    justify-content: flex-end;
  }

  a {
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

  a:hover {
    font-weight: 600;
  }

  a[active="true"] {
    font-weight: 600;
    border-bottom: 2px solid #fff;
  }
</style>

<nav flex="justify-end">
  {#each routes as route}
    <a
      href={route.to}
      name={route.name}
      active={route.active}
      on:click={() => preRouting(route.name)}>
      {route.name}
    </a>
  {/each}
</nav>

<!-- <page-name>{pageName}</page-name> -->
