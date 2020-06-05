<script>
	import { onMount } from 'svelte'

	import { supportsWebp } from '../../../services/helper.service.js'
	import { fetchAchievementImage, steamImageUrls } from '../../../services/fetch.service.js'

	export let gameId
	export let achId
	export let isAchieved = false
	let src = ''

	onMount(async () => {
		let imageSrc = await fetchAchievementImage(gameId, achId, isAchieved)
		src = imageSrc
	})
</script>

<img {src} class="foobar" alt="" />

<style>
	img {
		width: 4rem;
		height: 4rem;
		max-width: 4rem;
		max-height: 4rem;
		min-width: 3rem;
		min-height: 3rem;

		grid-area: 1 / 1 / span 2 / 1;
	}
</style>
