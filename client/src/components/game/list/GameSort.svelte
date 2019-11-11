<script>
  import { sortAchievementAmount, sortDifficulty,sortPoints } from "store/store.js";

  let sortTimeout;

</script>

<style lang="scss">
  sort-options {
    sort-option {
      state {
        display: inline-block;
        height: 16px;
        width: 16px;
      }
      state[value="0"]::after {
        content: "🡇";
      }
      state[value="1"]::after {
        content: "🡅";
      }
      state[value="2"]::after {
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
      on:click={() => sortAchievementAmount.update(n => (n + 1) % 3)}>
      <span>Achievement Amount</span>
      <state value={$sortAchievementAmount} />
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sortDifficulty.update(n => (n + 1) % 3)}>
      <span>Difficulty</span>
      <state value={$sortDifficulty} />
    </sort-option>
    <sort-option
      cursor="pointer"
      on:click={() => sortPoints.update(n => (n + 1) % 3)}>
      <span>Points</span>
      <state value={$sortPoints} />
    </sort-option>
    <sort-option>
      <span>Release Date</span>
      <state />
    </sort-option>
    <sort-option>
      <span>Score</span>
      <state />
    </sort-option>
    <sort-option>
      <span>Trend</span>
      <state />
    </sort-option>
  </sort-options>
</game-sort>
