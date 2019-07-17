<template>
  <Game>
    <h1>Game</h1>
  </Game>
</template>

<script>
import { value, onCreated } from "vue-function-api";

export default {
  setup() {
    const game = value(undefined);

    onCreated(() => {});

    return {
      game
    };
  }
};
</script>

<style>
</style>
