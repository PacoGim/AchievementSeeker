<script>
	import { onMount } from 'svelte'
	import { getCookiesAsJson } from '../../services/helper.service.js'

	let steamId = 'Loading...'
</script>

<h1>Login</h1>
<a href="http://192.168.1.199:3000/steam/login">LogIn!</a>
<h2>{steamId}</h2>
