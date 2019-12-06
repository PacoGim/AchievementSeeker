<script>
	import { onMount } from 'svelte'

	import { isWebpSupported } from 'services/helper.service.js'

	import { router } from 'store/store.js'

	import LayoutNavbar from 'components/layout/LayoutNavbar.svelte'
	import LayoutFancyBG from 'components/layout/LayoutFancyBG.svelte'

	onMount(async () => {
		if (window.isWebpSupported === undefined) {
			await isWebpSupported()
		}
	})
</script>

<LayoutNavbar />
<LayoutFancyBG />
<route-name text="weight-6" flex="justify-center align-center">{$router['currentRoute']}</route-name>
<slot />

<style lang="scss" global>
	@import 'styles/global.scss';

	route-name {
		height: 40vh;
		font-size: 3rem;

		transition: opacity, transform cubic-bezier(0, 0, 0, 2);
		transition-duration: 0.5s;
	}

	body {
		min-height: 100vh;
	}
</style>
