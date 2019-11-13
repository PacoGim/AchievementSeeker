<script context="module">
  import { buildQuery } from "services/graphql.service.js";
  import { fetchServer } from "services/fetch.service.js";
  export async function preload({ params, query: urlQuery }) {
    let { query, sort, filter } = await buildQuery(urlQuery);

    let gameList = await getGameSearchGames({
      query: query,
      sort: sort,
      filter: filter
    });

    return { gameList };
  }
</script>

<script>
  import { onMount } from "svelte";

  import GameSearch from "components/game/list/GameSearch.svelte";
  import GameSort from "components/game/list/GameSort.svelte";
  import GameFilter from "components/game/list/GameFilter.svelte";

  import { setFancyBG } from "services/fancyBG.service.js";
  import { parseDate } from "services/helper.service.js";
  import { getGameSearchGames } from "services/graphql.service.js";

  import { sorting, filtering } from "store/store.js";

  const componentName = "Game List";

  export let gameList;

  // Checks if the reactive statements were run already. Avoids running the reactive statements at component mount/launch.
  let dirty = false;

  $: {
    if (dirty === true) {
      console.log("Running reactive statements...");

      $sorting;
      $filtering;

      buildQuery().then(({ query, sort, filter }) => {
        // console.log("List.svelte Query", query);
        // console.log("List.svelte Sort", sort);
        // console.log("List.svelte Filter", filter);
        getGameSearchGames({
          query: query,
          sort: sort,
          filter: filter
        }).then(res => {
          gameList = res;
        });
      });
    } else {
      dirty = true;
    }
  }

  onMount(() => {
    setFancyBG({
      color1: "#41295a",
      color2: "#2f0743",
      transform1: "skewY(-10deg) translateY(0)",
      transform2: "skewY(10deg) translateY(0)"
    });
  });
</script>

<game-list flex="direction-column align-center">
  <GameSearch />
  <h1>Or choose options below</h1>
  <GameSort />
  <GameFilter />

  {#if gameList !== undefined}
    {#each gameList as game (game['_id'])}
      <p>
        <span>{game['name']}</span>

        {#if game['difficulty']}
          <span>Difficulty:{game['difficulty']['average']}</span>
        {/if}

        {#if game['points']}
          <span>Points:{game['points']}</span>
        {/if}

        {#if game['achievementCount']}
          <span>Ach Count:{game['achievementCount']}</span>
        {/if}

        {#if game['score']}
          <span>Score:{game['score']}</span>
        {/if}

        {#if game['trend']}
          <span>Trend:{game['trend']}</span>
        {/if}

        {#if game['releaseDate']}
          <span>RD:{parseDate(game['releaseDate'])}</span>
        {/if}

        {#if game['difficulty']}
          <span>Difficulty:{game['difficulty']['average']}</span>
        {/if}

        {#if game['genres']}
          <span>
            Genres:
            {#each game['genres'] as genre,index (index)}
              {genre['type']},
            {/each}
          </span>
        {/if}
        {#if game['developers']}
          <span>
            Developers:
            {#each game['developers'] as developer (game['developers']['name'])}
              {developer['name']},
            {/each}
          </span>
        {/if}
        {#if game['publishers']}
          <span>
            Publishers:
            {#each game['publishers'] as publisher (game['publishers']['name'])}
              {publisher['name']},
            {/each}
          </span>
        {/if}
      </p>
    {/each}
  {/if}
</game-list>

<svelte:head>
  <title>{componentName}</title>
</svelte:head>
