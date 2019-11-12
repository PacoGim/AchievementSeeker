<script>
  import { onMount, onDestroy } from "svelte";
  import { fetchServer } from "services/fetch.service.js";
  import GameHeader from "components/game/GameHeader.svelte";

  let searchGameInput = "";
  let gameList = [];
  let gameFiltered = [];
  let timeout;

  onMount(async () => {
    gameList = await fetchServer("/games/allGames");
    // searchGame();
  });

  //TODO: This down there is not possible, get's trigger at mounted ;_;
  $: {
    searchGameInput;
    searchGame();
  }

  function searchGame() {
    clearInterval(timeout);
    if (searchGameInput !== "" && searchGameInput !== undefined) {
      timeout = setTimeout(() => {
        gameFiltered = gameList.filter(game =>
          game["name"].toLowerCase().includes(searchGameInput.toLowerCase())
        ).slice(0,20);
      }, 500);
    } else {
      gameFiltered = [];
    }
  }
</script>

<style lang="scss">
  game-search {
    position: relative;
    min-width: 33vw;
    max-width: 100vw;
  }

  search-box {
    height: 50px;
    width: 100%;

    search-icon {
      height: inherit;
      width: auto;
      background: #fff;
      cursor: pointer;
      padding: 0.5rem;
    }
  }

  search-input {
    height: inherit;
    width: 100%;

    input {
      text-align: center;
      height: inherit;
      padding: 1rem;
      font-size: inherit;
      font-family: inherit;
      background: transparent;
      border: none;
      box-shadow: inset 0 -3px 0 0 #fff;
    }

    input:focus ~ search-input-placeholder,
    input[value] ~ search-input-placeholder {
      transform: translateY(-40px);
      font-size: 0.85rem;
    }

    input:focus ~ search-input-placeholder span #here-now::after,
    input[value] ~ search-input-placeholder span #here-now::after {
      content: "now";
    }
  }

  search-input-placeholder {
    width: 100%;
    pointer-events: none;
    padding: 1rem;

    transition: transform 0.3s cubic-bezier(0, 0, 0, 1.75),
      font-size 0.3s cubic-bezier(0, 0, 0, 1.75);

    span #here-now::after {
      content: "here";
    }
  }

  game-search-list {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    position: absolute;

    a {
      padding: 0.2rem;
    }
  }
</style>

<game-search>
  <search-box flex="direction-row align-center">
    <search-input grid="overlap">
      <input
        list="gameSearchHistory"
        font="white"
        type="text"
        oninput="this.value===''?this.removeAttribute('value'):this.setAttribute('value',this.value)"
        bind:value={searchGameInput} />
      <!-- <datalist id="gameSearchHistory">
        {#each gameSearchHistory as game}
          <option value={game} />
        {/each}
      </datalist> -->
      <search-input-placeholder flex="align-center justify-center" font="white">
        <span>
          Type
          <span id="here-now" />
          to
        </span>
        <span font="casual-italic bold">&nbsp;Search for Games</span>
      </search-input-placeholder>
    </search-input>
    <search-icon>
      <img class="icon" icon="fit-height" src="icons/search.svg" alt="" />
    </search-icon>
  </search-box>
  <game-search-list flex="direction-column">
    {#each gameFiltered as game (game['_id'])}
      <a href="game/{game['_id']}" flex="direction-row align-center">
        <GameHeader
          styleClass="game-search-header"
          gameID={game['_id']} />
        <!-- <GameHeader
          styleClass="game-search-header"
          gameID={game['_id']}
          gameAppid={game['appid']}
          gameName={game['name']} /> -->
        <name>{game['name']}</name>
      </a>
    {/each}
  </game-search-list>
</game-search>
<!-- TODO: Glass to cross and Remove TM when searching -->
