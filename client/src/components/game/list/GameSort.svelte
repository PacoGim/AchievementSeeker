<script>
  import { sorting } from "store/store.js";
</script>

<style lang="scss">
  game-sort {
    width: 100vw;
  }
  sort-options {
    sort-option {
      state {
        display: inline-block;
        height: 16px;
        width: 16px;
      }
      state[value="-1"]::after {
        content: "🡇";
      }
      state[value="1"]::after {
        content: "🡅";
      }
      state[value="0"]::after {
        content: "";
      }
    }
  }
</style>

<game-sort flex="direction-row align-center">
  <h2>Sort</h2>
  <sort-options user-select="none">
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('achievementCount')}>
      <span>Achievement Amount</span>
      <state value={$sorting.achievementCount} />
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('difficulty')}>
      <span>Difficulty</span>
      <state value={$sorting.difficulty} />
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('points')}>
      <span>Points</span>
      <state value={$sorting.points} />
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sorting.cycleValue('releaseDate')}>
      <span>Release Date</span>
      <state value={$sorting.releaseDate} />
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('score')}>
      <span>Score</span>
      <state value={$sorting.score} />
    </sort-option>
    <sort-option cursor="pointer" on:click={() => sorting.cycleValue('trend')}>
      <span>Trend</span>
      <state value={$sorting.trend} />
    </sort-option>

  </sort-options>
</game-sort>
