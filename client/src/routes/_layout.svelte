<script>
	import { onMount } from 'svelte'

	import { isUserLogged } from '../store/user.store.js'

	import Navigation from '../components/Navigation.svelte'

	onMount(async () => {
		let response = await fetch('http://192.168.1.199:3000/user/isLoggedIn', { credentials: 'include' }).then(res => res.json())

		if (response && response['code'] === 201) {
			$isUserLogged = true
		} else {
			$isUserLogged = false
		}
	})
</script>

<Navigation />

<main>
	<slot />
</main>

<style lang="scss" global>
	@import 'styles/global.scss';

	main {
		max-width: 1080px;
		margin: 0 auto;
	}
</style>
