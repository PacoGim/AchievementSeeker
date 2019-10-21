<script>
  import {onMount} from "svelte";

  import {setFancyBG} from 'services/fancyBG.service.js'

  let name = "Home";

  onMount(()=>{
    setFancyBG('#cb2d3e','#ef473a','skewY(2deg) translateY(-60px)','skewY(-2deg) translateY(-60px)')
  })
</script>

<style>

</style>

<svelte:head>
  <title>{name}</title>
</svelte:head>

<home>
  <h1>{name}</h1>
</home>
