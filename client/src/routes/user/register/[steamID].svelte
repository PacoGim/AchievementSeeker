<script>
  import { onMount } from "svelte";

  let id = "...";
  let avatar = "Loading...";
  let name = undefined;

  onMount(() => {
    id = atob(location["pathname"].split("/")[3]);

    fetch(`http://localhost:443/user/GetUserDataBySteamID/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);

        name = data["personaname"];
      });
  });
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<register-step-2>
  <header>
    {#if name === undefined}Loading user {id}{:else}{name}{/if}
  </header>
  <corp />
</register-step-2>
