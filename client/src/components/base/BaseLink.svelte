<script>
	import { onMount } from 'svelte'
	import { router } from 'store/store.js'

	export let to
	export let id
	export let rel
	export let name = undefined
	export let isActive = undefined
	export let useClass = undefined
	// export let loadFancyBG = undefined;

	onMount(() => {
		if (name === document.title) {
			setCurrentRouteAsActive()
		}
	})

	function setCurrentRouteAsActive() {
		router.setActiveRoute(name)
	}
</script>

<a {id} class={useClass} {rel} href={to} {isActive} on:click={() => setCurrentRouteAsActive()}>
	<slot />
</a>

<style>
	a.navbar-link {
		user-select: none;
		display: inline;
		font-size: 1.1rem;
		color: inherit;
		text-decoration: none;
		font-variation-settings: 'wght' var(--font-weight-4);
		padding: 0.5rem;
		padding-bottom: 0.2rem;
		margin: 0 0.5rem;
		border-bottom: 2px solid transparent;

		transition: font-variation-settings 0.3s, border-bottom 1s;
	}

	a.navbar-link[isActive='true'] {
		pointer-events: none;
		border-bottom: 2px solid #fff;
	}

	a.navbar-link:hover,
	a.navbar-link[isActive='true'] {
		font-variation-settings: 'wght' var(--font-weight-9);
	}
</style>
