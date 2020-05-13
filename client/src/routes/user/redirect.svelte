<script>
	import { onMount } from 'svelte'

	onMount(() => {
		document.location.replace(localStorage.getItem('lastLocation'))
	})
</script>
