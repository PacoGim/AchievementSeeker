<script>
  import { fetchServer } from "services/fetch.service.js";
  import BaseClose from "components/base/BaseClose.svelte";
  import BaseGameListFilterInput from "components/base/BaseGameListFilterInput.svelte";

  import { filtering } from "store/store.js";
  import { onMount } from "svelte";

  let developers = [];
  let publishers = [];
  let genres = [];
  let selectedGenre = "";

  let isDeveloperContainerVisible = true;
  let isPublisherContainerVisible = false;
  let isGenreContainerVisible = false;
  let isDifficultyContainerVisible = false;
  let isPlatformsContainerVisible = false;

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

  function setDifficulty(difficulty) {
    setAllContainersVisibilityToFalse();
    filtering.setDifficulty(difficulty);
  }

  function genreSelected() {
    setAllContainersVisibilityToFalse();
    filtering.setGenre(selectedGenre);
  }

  function toggleContainerVisibility(containerName) {
    setAllContainersVisibilityToFalse();

    switch (containerName) {
      case "developers":
        isDeveloperContainerVisible = true;
        break;
      case "publishers":
        isPublisherContainerVisible = true;
        break;
      case "genres":
        isGenreContainerVisible = true;
        break;
      case "difficulty":
        isDifficultyContainerVisible = true;
        break;
      case "platforms":
        isPlatformsContainerVisible = true;
        break;
    }
  }

  function setAllContainersVisibilityToFalse() {
    isDeveloperContainerVisible = false;
    isPublisherContainerVisible = false;
    isGenreContainerVisible = false;
    isDifficultyContainerVisible = false;
    isPlatformsContainerVisible = false;
  }
</script>

<style lang="scss">
  game-filter {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 1rem;

    filter-options {
      width: 100%;

      filter-option {
        background-color: rgba(0, 0, 0, 0.75);
        padding: 0.5rem 1rem;
        margin-left: 1rem;
        white-space: nowrap;
      }
    }
  }

  game-filter-selector {
    width: 100%;

    & > * {
      background-color: rgba(0, 0, 0, 0.75);
      padding: 0.5rem 1rem;
      transition: transform 0.3s, opacity 0.3s;

      h2 {
        margin-right: 1rem;
      }

      &.hide-container {
        pointer-events: none;
        transform: translateY(-50px);
        opacity: 0;
      }
      &.show-container {
        transform: translateY(0px);
        opacity: 1;
      }
    }
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
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      display: inline-block;

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
  <h2>Filter:</h2>
  <filter-options flex="direction-row align-center" user-select="none">

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => toggleContainerVisibility('developers')}>
      <span>Developer</span>
      <selected>{$filtering.developer}</selected>
    </filter-option>

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => toggleContainerVisibility('publishers')}>
      <span>Publisher</span>
      <selected>{$filtering.publisher}</selected>
    </filter-option>

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => toggleContainerVisibility('genres')}>
      <span>Genre</span>
      <selected>{$filtering.genre}</selected>
    </filter-option>

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => toggleContainerVisibility('difficulty')}>
      <span>Difficulty</span>
      <selected>
        {#if $filtering.difficulty !== undefined}{$filtering.difficulty}{/if}
      </selected>
    </filter-option>

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => toggleContainerVisibility('platforms')}>
      <span>Platforms</span>
      <selected>{$filtering.platform}</selected>
    </filter-option>

    <filter-option
      cursor="pointer"
      flex="direction-column align-center"
      on:click={() => filtering.cycleIsFree()}>
      <span>Free to play?</span>
      <selected>
        {#if $filtering.isFree !== undefined}
          {$filtering.isFree === 'true' ? 'Yes' : 'No'}
        {/if}
      </selected>
    </filter-option>

  </filter-options>
</game-filter>

<game-filter-selector grid="overlap">

  <developer-selector
    class={isDeveloperContainerVisible === true ? 'show-container' : 'hide-container'}
    flex="direction-row align-center">
    <BaseClose
      message="developerClose"
      on:developerClose={() => (isDeveloperContainerVisible = false)} />
    <h2>Developer:</h2>

    <BaseGameListFilterInput id="developer-list" data={developers} />

    <span>Remove Developer</span>
  </developer-selector>

  <publisher-selector
    class={isPublisherContainerVisible === true ? 'show-container' : 'hide-container'}
    flex="direction-row align-center">
    <BaseClose
      message="publisherClose"
      on:publisherClose={() => (isPublisherContainerVisible = false)} />
    <h2>Publisher:</h2>

    <BaseGameListFilterInput id="publisher-list" data={publishers} />

  </publisher-selector>

  <genre-selector
    class={isGenreContainerVisible === true ? 'show-container' : 'hide-container'}
    flex="direction-row align-center">
    <BaseClose
      message="genreClose"
      on:genreClose={() => (isGenreContainerVisible = false)} />
    <h2>Genre:</h2>
    <select on:change={() => genreSelected()} bind:value={selectedGenre}>
      <option value="none">Select Genre</option>
      {#each genres as genre, index (index)}
        <option value={genre}>{genre}</option>
      {/each}
    </select>
  </genre-selector>

  <difficulty-selector
    class={isDifficultyContainerVisible === true ? 'show-container' : 'hide-container'}
    flex="direction-row align-center">
    <BaseClose
      message="difficultyClose"
      on:difficultyClose={() => (isDifficultyContainerVisible = false)} />
    <h2>Difficulty:</h2>
    <difficulties>
      <difficulty class="any" on:click={() => setDifficulty(undefined)}>
        Any
      </difficulty>
      <difficulty class="_0-10" on:click={() => setDifficulty(0)}>
        0-10
      </difficulty>
      <difficulty class="_10-20" on:click={() => setDifficulty(10)}>
        10-20
      </difficulty>
      <difficulty class="_20-30" on:click={() => setDifficulty(20)}>
        20-30
      </difficulty>
      <difficulty class="_30-40" on:click={() => setDifficulty(30)}>
        30-40
      </difficulty>
      <difficulty class="_40-50" on:click={() => setDifficulty(40)}>
        40-50
      </difficulty>
      <difficulty class="_50-60" on:click={() => setDifficulty(50)}>
        50-60
      </difficulty>
      <difficulty class="_60-70" on:click={() => setDifficulty(60)}>
        60-70
      </difficulty>
      <difficulty class="_70-80" on:click={() => setDifficulty(70)}>
        70-80
      </difficulty>
      <difficulty class="_80-90" on:click={() => setDifficulty(80)}>
        80-90
      </difficulty>
      <difficulty class="_90-100" on:click={() => setDifficulty(90)}>
        90-100
      </difficulty>
    </difficulties>
  </difficulty-selector>

  <platform-selector
    class={isPlatformsContainerVisible === true ? 'show-container' : 'hide-container'}
    flex="direction-row align-center">
    <BaseClose
      message="platformClose"
      on:platformClose={() => (isPlatformsContainerVisible = false)} />
    <h2>Platforms:</h2>
    <platforms>
      <platform cursor="pointer" on:click={() => filtering.setPlatform('ALL')}>
        All
      </platform>
      <platform
        cursor="pointer"
        on:click={() => filtering.setPlatform('WINDOWS')}>
        Windows
      </platform>
      <platform cursor="pointer" on:click={() => filtering.setPlatform('MAC')}>
        Mac
      </platform>
      <platform
        cursor="pointer"
        on:click={() => filtering.setPlatform('LINUX')}>
        Linux
      </platform>
    </platforms>
  </platform-selector>
</game-filter-selector>
