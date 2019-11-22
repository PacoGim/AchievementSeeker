<script>
  import { sorting } from "store/store.js";
</script>

<style lang="scss">
  game-sort {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    padding: 1rem;
    sort-options {
      width: 100%;
      margin-left: 1rem;

      sort-option {
        background-color: rgba(0, 0, 0, 0.75);
        padding: 0.5rem 1rem;
        // width: max-content;
        display: inline-block;
        white-space: nowrap;

        state {
          display: inline-block;
          height: 16px;
          width: auto;

          transition: opacity 0.3s, transform 0.3s;
        }
        state[value="-1"] {
          transform: rotateX(0deg);
          opacity: 1;
        }
        state[value="1"] {
          transform: rotateX(180deg) translateY(-6px);
          opacity: 1;
        }
        state[value="0"] {
          transform: rotateX(0deg);
          opacity: 0;
        }
      }
    }
  }
</style>

<game-sort flex="direction-row align-center">
  <h2>Sort:</h2>
  <sort-options user-select="none">
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('achievementCount')}>
      <span>Achievement Amount</span>
      <state value={$sorting.achievementCount}>🡇</state>
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('difficulty')}>
      <span>Difficulty</span>
      <state value={$sorting.difficulty}>🡇</state>
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('points')}>
      <span>Points</span>
      <state value={$sorting.points}>🡇</state>
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('releaseDate')}>
      <span>Release Date</span>
      <state value={$sorting.releaseDate}>🡇</state>
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('score')}>
      <span>Score</span>
      <state value={$sorting.score}>🡇</state>
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('trend')}>
      <span>Trend</span>
      <state value={$sorting.trend}>🡇</state>
    </sort-option>

  </sort-options>
</game-sort>
