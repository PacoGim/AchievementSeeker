<script>
	import { onMount } from 'svelte'

	import { setFancyBG } from 'services/fancyBG.service.js'

	let id = '...'
	let avatar = 'Loading...'
	let name = undefined

	const componentName = 'Register'

	onMount(() => {
		setFancyBG('#C81949', '#1A1408', 'skewY(15deg) translateY(-10px)', 'skewY(-15deg) translateY(-60px)')
		id = atob(location['pathname'].split('/')[3])

		fetch(`http://localhost:443/user/GetUserDataBySteamID/${id}`)
			.then(res => res.json())
			.then(data => {
				// console.log(data);

				name = data['personaname']
			})
	})
</script>

<svelte:head>
	<title>{componentName}</title>
</svelte:head>

<register-step-2>
	<header>
		{#if name === undefined}Loading user {id}{:else}{name}{/if}
	</header>
	<corp />
</register-step-2>
