<script>
  import { isDay } from "store/store.js";

  let isDayBoolean = false;

  isDay.subscribe(value => (isDayBoolean = value));

  function toggleDayNight() {
    isDay.set(!isDayBoolean);
  }
</script>

<style>
  img {
    cursor: pointer;
    padding: 0.5rem;
    padding-bottom: 0.2rem;
    margin: 0 0.5rem;
  }
</style>

{#if isDayBoolean}
  <img
    icon="fit-height white"
    src="icons/moon.svg"
    alt=""
    on:click={toggleDayNight} />
{:else}
  <img
    icon="fit-height white"
    src="icons/sun.svg"
    alt=""
    on:click={toggleDayNight} />
{/if}
