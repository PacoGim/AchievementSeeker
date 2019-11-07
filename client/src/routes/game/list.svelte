<script>
  import { onMount } from "svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  import { sortAchievementAmount, sortDifficulty } from "store/store.js";

  import GameSearch from "components/game/list/GameSearch.svelte";
  import GameSortFilter from "components/game/list/GameSortFilter.svelte";

  import { getGameSearchGames } from "services/graphql.service.js";

  const componentName = "Game List";

  let gameList = [];

  $: {
    let query = "_id appid name ";
    let sort = "{";
    let filter = "{";

    let achievementCount = $sortAchievementAmount;
    let difficulty = $sortDifficulty;

    if (difficulty !== 2) {
      query += "difficulty{average} ";
      sort += `difficulty:${difficulty === 0 ? "-1" : "1"} `;
    }

    if (achievementCount !== 2) {
      query += "achievementCount ";
      sort += `achievementCount:${achievementCount === 0 ? "-1" : "1"} `;
    }

    sort += "}";
    filter += "}";

    console.log(sort);

    getGameSearchGames({ query, sort, filter }).then(res => {
      gameList = res;
    });
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
  <GameSortFilter />

  {#each gameList as game (game['_id'])}
    <p>
      <span>{game['name']}</span>
      {#if game['difficulty']}
        <span>Difficulty:{game['difficulty']['average']}</span>
      {/if}
      {#if game['achievementCount']}
        <span>Ach Count:{game['achievementCount']}</span>
      {/if}
    </p>
  {/each}

</game-list>

<svelte:head>
  <title>{componentName}</title>
</svelte:head>
