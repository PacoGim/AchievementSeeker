<script>
  import { onMount, onDestroy } from "svelte";
  import { fetchServer } from "services/fetch.service.js";

  let searchGameInput = "";
  let gameList = [];
  let gameFiltered = [];
  let timeout;

  onMount(async () => {
    gameList = await fetchServer("/allGames");
    searchGame();
  });

  $: {
    searchGameInput;
    searchGame();
  }

  function searchGame() {
    gameFiltered = [];
    clearInterval(timeout);
    if (searchGameInput !== "" && searchGameInput !== undefined) {
      timeout = setTimeout(() => {
        gameFiltered = gameList.filter(game =>
          game["name"].toLowerCase().includes(searchGameInput.toLowerCase())
        );
      }, 1000);
    }
  }
</script>

<style>
  search-box {
    height: 50px;
    width: 33vw;
  }

  search-box search-icon {
    height: inherit;
    width: auto;
    background: #fff;
    cursor: pointer;
    padding: 0.5rem;
  }
  search-box .icon {
    transition: filter 0.3s;
  }

  search-box .icon:hover {
    filter: invert(15%) sepia(51%) saturate(871%) hue-rotate(229deg)
      brightness(95%) contrast(91%);
  }

  search-input {
    height: inherit;
    width: 100%;
  }

  search-input input {
    text-align: center;
    height: inherit;
    padding: 1rem;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    border: none;
    box-shadow: inset 0 -3px 0 0 #fff;
  }

  search-input input:focus ~ search-input-placeholder,
  search-input input[value] ~ search-input-placeholder {
    transform: translateY(-40px);
    font-size: 0.85rem;
  }

  search-input input:focus ~ search-input-placeholder span #here-now::after,
  search-input input[value] ~ search-input-placeholder span #here-now::after {
    content: "now";
  }

  search-input-placeholder {
    width: 100%;
    pointer-events: none;
    padding: 1rem;

    transition: transform 0.3s cubic-bezier(0, 0, 0, 1.75),
      font-size 0.3s cubic-bezier(0, 0, 0, 1.75);
  }
  search-input-placeholder span #here-now::after {
    content: "here";
  }
</style>

<!--         on:input={searchGame} -->
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
        <span font="italic bold">&nbsp;&nbsp;Search for Games</span>
      </search-input-placeholder>
    </search-input>
    <search-icon>
      <img class="icon" icon="fit-height" src="icons/search.svg" alt="" />
    </search-icon>
  </search-box>
  <game-list>
    {#each gameFiltered as game}
      <p>{game['name']}</p>
    {/each}
  </game-list>
</game-search>
