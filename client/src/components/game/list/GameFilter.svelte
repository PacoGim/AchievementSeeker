<script>
  import { fetchServer } from "services/fetch.service.js";

  import { filtering } from "store/store.js";
  import { onMount } from "svelte";

  let developers = [];
  let publishers = [];
  let genres = [];
  let selectedGenre = "";
  let selectedDeveloper = "";
  let selectedPublisher = "";

  let developerTimeout = undefined;
  let publisherTimeout = undefined;

  onMount(() => {
    let genresUrl = "/games/genres";
    let developersUrl = "/games/developers";
    let publishersUrl = "/games/publishers";

    let genresStorage = sessionStorage.getItem(genresUrl);
    let developersStorage = sessionStorage.getItem(developersUrl);
    let publishersStorage = sessionStorage.getItem(publishersUrl);

    if (genresStorage !== null) {
      genres = JSON.parse(genresStorage);
    } else {
      fetchServer(genresUrl).then(data => {
        data = data
          .filter(a => a !== "" && a !== " ")
          .sort((a, b) => a.localeCompare(b));
        developers = data;
        genres = data;
        sessionStorage.setItem(genresUrl, JSON.stringify(genres));
      });
    }

    if (developersStorage !== null) {
      developers = JSON.parse(developersStorage);
    } else {
      fetchServer(developersUrl).then(data => {
        data = data
          .filter(a => a !== "" && a !== " ")
          .sort((a, b) => a.localeCompare(b));
        developers = data;
        sessionStorage.setItem(developersUrl, JSON.stringify(developers));
      });
    }

    if (publishersStorage !== null) {
      publishers = JSON.parse(publishersStorage);
    } else {
      fetchServer(publishersUrl).then(data => {
        data = data
          .filter(a => a !== "" && a !== " ")
          .sort((a, b) => a.localeCompare(b));
        publishers = data;
        sessionStorage.setItem(publishersUrl, JSON.stringify(publishers));
      });
    }
  });

  function inputChanged(type, { keyCode }) {
    if (keyCode === 13) {
      if (type === "developer") {
        setDeveloper();
      } else if (type === "publisher") {
        setPublisher();
      }
    }
  }

  $: {
    selectedDeveloper;

    clearTimeout(developerTimeout);

    developerTimeout = setTimeout(() => {
      setDeveloper();
    }, 500);
  }

  $: {
    selectedPublisher;

    clearTimeout(publisherTimeout);

    publisherTimeout = setTimeout(() => {
      setPublisher();
    }, 500);
  }

  function setDeveloper() {
    let found = developers.find(
      a => a.toLowerCase() === selectedDeveloper.toLowerCase()
    );

    if (found !== undefined) {
      filtering.setDeveloper(found);
    } else {
      filtering.setDeveloper("");

      //TODO: Developer not found
    }
  }

  function setPublisher() {
    let found = publishers.find(
      a => a.toLowerCase() === selectedPublisher.toLowerCase()
    );

    if (found !== undefined) {
      filtering.setPublisher(found);
    } else {
      filtering.setPublisher("");

      //TODO: Developer not found
    }
  }

  function genreSelected() {
    filtering.setGenre(selectedGenre);
  }
</script>

<style lang="scss">
  game-filter {
    width: 100vw;
  }

  game-filter-selector {
    width: 100vw;
  }

  game-filter-selector input,
  game-filter-selector select {
    font-family: inherit;
    background-color: rgba(0, 0, 0, 0.75);
    color: #fff;
    font-size: inherit;
    padding: 0.5rem;
    font-variation-settings: "MONO" 0.5, "CASL" 1, "ital" 1, "slnt" 0;
    border-style: solid;
    border-color: #fff;
    border-width: 0 0 0.15rem 0;
  }
</style>

<game-filter flex="direction-row align-center">
  <h2>Filter</h2>
  <filter-options>
    <filter-option flex="direction-column align-center">
      <span>Developer</span>
      <selected>{$filtering.developer}</selected>
    </filter-option>
  </filter-options>
</game-filter>
<game-filter-selector>

  <developer-selector flex="direction-row align-center">
    {#if developers !== undefined}
      <h2>Developer</h2>
      <input
        list="developers-list"
        on:keypress={e => inputChanged('developer', e)}
        on:change={e => inputChanged('developer', e)}
        bind:value={selectedDeveloper}
        placeholder="Search for developers here" />
      <datalist id="developers-list">
        {#each developers as developer, index (index)}
          <option value={developer}>{developer}</option>
        {/each}
      </datalist>
    {/if}
  </developer-selector>

  <publisher-selector flex="direction-row align-center">
    {#if publishers !== undefined}
      <h2>Publisher</h2>
      <input
        list="publishers-list"
        on:keypress={e => inputChanged('publisher', e)}
        on:change={e => inputChanged('publisher', e)}
        bind:value={selectedPublisher}
        placeholder="Search for publishers here" />
      <datalist id="publishers-list">
        {#each publishers as publisher, index (index)}
          <option value={publisher}>{publisher}</option>
        {/each}
      </datalist>
    {/if}
  </publisher-selector>

  <genre-selector flex="direction-row align-center">
    {#if genres !== undefined}
      <h2>Genre</h2>
      <select on:change={() => genreSelected()} bind:value={selectedGenre}>
        <option value="none">Select Genre</option>
        {#each genres as genre, index (index)}
          <option value={genre}>{genre}</option>
        {/each}
      </select>
    {/if}
  </genre-selector>
</game-filter-selector>
