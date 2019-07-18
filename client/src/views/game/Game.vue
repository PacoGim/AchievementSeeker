<template>
  <Game>
    <h1>Game</h1>
    <daty v-if="isGameLoaded">{{game.name}}</daty>
  </Game>
</template>

<script>
import { value, onCreated } from "vue-function-api";
import { get } from "axios";

export default {
  setup(props, ctx) {
    let game = value(undefined);
    let isGameLoaded = value(false);

    const gameID = ctx["root"]["$route"]["params"]["id"];

    onCreated(() => {
      get(`https://localhost/games/${gameID}`).then(data => {
        game.value = data["data"];
        isGameLoaded.value = true;
        ctx["root"]["$store"].set("currentRoute", game["value"]["name"]);
      });
    });

    return {
      game,
      isGameLoaded
    };
  }
};
</script>

<style>
</style>
