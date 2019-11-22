<script>
  import { onMount } from "svelte";
  import { genID } from "services/helper.service.js";
  import { filtering } from "store/store.js";

  export let data;

  export let id;

  export let selectedDeveloper = "";
  export let selectedPublisher = "";

  let developerTimeout = undefined;
  let publisherTimeout = undefined;

  $: {
    if (selectedDeveloper !== "") {
      clearTimeout(developerTimeout);

      developerTimeout = setTimeout(() => {
        setDeveloper();
      }, 500);
    }
  }

  $: {
    if (selectedPublisher !== "") {
      clearTimeout(publisherTimeout);

      publisherTimeout = setTimeout(() => {
        setPublisher();
      }, 500);
    }
  }

  function setDeveloper() {
    let found = data.find(
      a => a.toLowerCase() === selectedDeveloper.toLowerCase()
    );

    if (found !== undefined) {
      filtering.setPublisher("");
      filtering.setDeveloper(found);
    } else {
      filtering.setDeveloper("");
    }
  }

  function setPublisher() {
    let found = data.find(
      a => a.toLowerCase() === selectedPublisher.toLowerCase()
    );

    if (found !== undefined) {
      filtering.setDeveloper("");
      filtering.setPublisher(found);
    } else {
      filtering.setPublisher("");
    }
  }
</script>

{#if id === 'developer-list'}
  <input type="text" list={id} bind:value={selectedDeveloper} />
{:else if id === 'publisher-list'}
  <input type="text" list={id} bind:value={selectedPublisher} />
{/if}

<datalist {id}>
  {#each data as value, index (index)}
    <option {value}>{value}</option>
  {/each}
</datalist>
