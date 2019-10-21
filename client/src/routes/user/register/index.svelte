<style>
  register {
    background-color: #fff;
    max-width: 33vw;
    min-width: 320px;
    margin: 0 auto;
    padding: 3rem;
    border-radius: 10px;
  }

  header {
    color: #af133d;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 3rem;
  }

  #steam-auth-button {
    color: #fff;
    text-decoration: none;
    border-radius: 10px;
  }

  #steam-auth-button > * {
    padding: 0.75rem 2rem;
    width: calc(100%);
    text-align: center;
  }

  #steam-auth-button steam-auth-text-1 {
    background-color: #1d1d1d;
    font-size: 1.25rem;
    border-radius: 10px 10px 0 0;
    font-weight: 600;
  }
  #steam-auth-button steam-auth-text-2 {
    background-color: #313131;
    border-radius: 0 0 10px 10px;
    font-size: 0.95rem;
  }
</style>

<script>
  import { onMount } from "svelte";

  import { setFancyBG } from "services/fancyBG.service.js";

  onMount(() => {
    setFancyBG(
      "#C81949",
      "#1A1408",
      "skewY(15deg) translateY(-10px)",
      "skewY(-15deg) translateY(-60px)"
    );
  });
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

<register flex="align-center direction-column" shadow>
  <header>
    To
    <strong>register</strong>
    , simply login through Steam by
    <strong>clicking the button below</strong>
    , we'll handle the rest.
  </header>
  <a
    id="steam-auth-button"
    href="http://localhost:443/steam/login"
    flex="direction-column"
    shadow>
    <steam-auth-text-1>Login through Steam</steam-auth-text-1>
    <steam-auth-text-2>
      Achievement Seeker is not affiliated with Steam
    </steam-auth-text-2>
  </a>
</register>
