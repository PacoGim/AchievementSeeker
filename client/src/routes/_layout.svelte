<script>
	import { onMount } from 'svelte'

	import { isUserLogged } from '../store/user.store.js'
	import { detectColorScheme } from '../services/helper.service'

	import Navigation from '../includes/Navigation.svelte'

	onMount(async () => {
		detectColorScheme()

		let response = await fetch('http://192.168.1.199:3000/user/isLoggedIn', { credentials: 'include' }).then((res) => res.json())

		if (response && response['code'] === 201) {
			$isUserLogged = true
		} else {
			$isUserLogged = false
		}

		setInterval(() => {
			detectColorScheme()
		}, 1000 * 5)
	})
</script>

<Navigation />

<main>
	<slot />
</main>

<style lang="scss" global>
	@import 'styles/global.scss';
</style>
