<script>
  import { createEventDispatcher } from "svelte";

  export let message;

  const dispatch = createEventDispatcher();
</script>

<style>
  close {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  close img[icon]{
    transition: transform .3s cubic-bezier(0,0,0,3);
  }

  close:hover img[icon] {
    transform: translateY(-3px) scale(.75);
  }

  close round {
    background-color: #fff;
    border-radius: 50px;
    height: 1.5rem;
    width: 1.5rem;
  }
</style>

<close
  on:click={() => dispatch(message)}
  grid="overlap align-center">
  <round />
  <img icon="fit-width" src="icons/arrow-up.svg" alt="^" />
</close>
