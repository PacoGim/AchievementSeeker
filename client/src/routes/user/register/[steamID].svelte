<script>
  import { onMount } from "svelte";

  let id = "Loading...";

  onMount(() => {
    id = atob(location["pathname"].split("/")[3]);
  });
</script>

<h1>{id}</h1>
