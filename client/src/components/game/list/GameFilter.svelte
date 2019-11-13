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

  function inputChanged(type, { keyCode }) {
    if (keyCode === 13) {
      if (type === "developer") {
        setDeveloper();
      } else if (type === "publisher") {
        setPublisher();
      }
    }
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

  function setDifficulty(difficulty) {
    filtering.setDifficulty(difficulty)
  }

  function genreSelected() {
    filtering.setGenre(selectedGenre);
  }
</script>

<style lang="scss">
  game-filter {
    width: 100%;
  }

  game-filter-selector {
    width: 100%;
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

  difficulty-selector {
    difficulty {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      // margin: 0 1rem;

      &.any {
        background: linear-gradient(to right, #999, #333);
      }

      &._0-10 {
        background: linear-gradient(to right, #39c21d, #2cc230);
      }
      &._10-20 {
        background: linear-gradient(to right, #1cc255, #19c285);
      }
      &._20-30 {
        background: linear-gradient(to right, #19c2b7, #19a1c2);
      }
      &._30-40 {
        background: linear-gradient(to right, #196dc2, #1e42c2);
      }
      &._40-50 {
        background: linear-gradient(to right, #3023c2, #5519c2);
      }
      &._50-60 {
        background: linear-gradient(to right, #8819c2, #ac19b7);
      }
      &._60-70 {
        background: linear-gradient(to right, #bf1993, #be356a);
      }
      &._70-80 {
        background: linear-gradient(to right, #a89533, #a1c219);
      }
      &._80-90 {
        background: linear-gradient(to right, #b6a019, #c27419);
      }
      &._90-100 {
        background: linear-gradient(to right, #c24a19, #c21a19);
      }
    }
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

  </developer-selector>

  <publisher-selector flex="direction-row align-center">
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

  </publisher-selector>

  <genre-selector flex="direction-row align-center">
    <h2>Genre</h2>
    <select on:change={() => genreSelected()} bind:value={selectedGenre}>
      <option value="none">Select Genre</option>
      {#each genres as genre, index (index)}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </genre-selector>

  <difficulty-selector flex="direction-row align-center">
    <h2>Difficulty</h2>
    <difficulties>
      <difficulty cursor="pointer" class="any" on:click={() => setDifficulty(undefined)}>
        Any
      </difficulty>
      <difficulty cursor="pointer" class="_0-10" on:click={() => setDifficulty(0)}>
        0-10
      </difficulty>
      <difficulty cursor="pointer" class="_10-20" on:click={() => setDifficulty(10)}>
        10-20
      </difficulty>
      <difficulty cursor="pointer" class="_20-30" on:click={() => setDifficulty(20)}>
        20-30
      </difficulty>
      <difficulty cursor="pointer" class="_30-40" on:click={() => setDifficulty(30)}>
        30-40
      </difficulty>
      <difficulty cursor="pointer" class="_40-50" on:click={() => setDifficulty(40)}>
        40-50
      </difficulty>
      <difficulty cursor="pointer" class="_50-60" on:click={() => setDifficulty(50)}>
        50-60
      </difficulty>
      <difficulty cursor="pointer" class="_60-70" on:click={() => setDifficulty(60)}>
        60-70
      </difficulty>
      <difficulty cursor="pointer" class="_70-80" on:click={() => setDifficulty(70)}>
        70-80
      </difficulty>
      <difficulty cursor="pointer" class="_80-90" on:click={() => setDifficulty(80)}>
        80-90
      </difficulty>
      <difficulty cursor="pointer" class="_90-100" on:click={() => setDifficulty(90)}>
        90-100
      </difficulty>
    </difficulties>
  </difficulty-selector>
</game-filter-selector>
