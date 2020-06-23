<script>
	import { onMount } from 'svelte'

	import { supportsWebp } from '../../../services/helper.service.js'
	import { fetchAchievementImage, steamImageUrls } from '../../../services/fetch.service.js'

	export let gameId
	export let achId
	export let isAchieved = false
	export let value
	export let gameName
	let classGray = false
	let isGrey = undefined
	let src = ''

	onMount(async () => {
		if (value !== 4) {
			let imageSrc = await fetchAchievementImage(gameId, achId, isAchieved)
			src = imageSrc
		} else {
			if (isAchieved === false) {
				isGrey = true
			}
			let gameSafeString = `${getSafeString(gameName, 20)}-${gameId}`

			if ((await supportsWebp()) === true) {
				src = `http://192.168.1.199:3000/public/images/${gameSafeString}/achievements/celestial/_.webp`
			} else {
				src = `http://192.168.1.199:3000/public/images/${gameSafeString}/achievements/celestial/_.jpeg`
			}
		}
	})

	function getSafeString(name, limit) {
		return name.replace(/[^a-zA-Z0-9]+/g, '').substring(0, limit)
	}

	async function fixError() {
		let imageSrc = await fetchAchievementImage(gameId, achId, true)
		isGrey = true
		src = imageSrc
	}
</script>

<img {src} {isGrey} alt="" on:error={() => fixError()} />

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

	img[isGrey='true'] {
		filter: grayscale(1) brightness(0.5);
	}
</style>
