<script>
	import { onMount } from 'svelte'

	onMount(async () => {
		let response = await fetch('http://192.168.1.199:3000/user/logout', { credentials: 'include' }).then(res => res.json())

		document.location.replace(localStorage.getItem('lastLocation'))
	})
</script>

<logout>
	<h1>Logout</h1>
</logout>
