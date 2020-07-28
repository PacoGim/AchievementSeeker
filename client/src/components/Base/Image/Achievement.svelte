<script>
	import { onMount } from 'svelte'

	import { supportsWebp } from '../../../services/helper.service.js'
	import { fetchAchievementImage, steamImageUrls } from '../../../services/fetch.service.js'

	import ImagePlaceHolder from '@/components/Base/Image/Placeholder.svelte'

	export let gameId
	export let achId
	export let isAchieved = false
	export let value
	export let gameName
	export let index = 0
	let loaded = false
	let classGray = false
	let isGrey = undefined
	let src = ''

	onMount(() => {
		setTimeout(async () => {
			if (value !== 4) {
				src = await fetchAchievementImage(gameId, achId, isAchieved)
				loaded = true
			} else {
				if (isAchieved === false) isGrey = true

				let gameSafeString = `${getSafeString(gameName, 20)}-${gameId}`

				if ((await supportsWebp()) === true) {
					src = `http://192.168.1.199:3000/public/images/${gameSafeString}/achievements/special/_.webp`
				} else {
					src = `http://192.168.1.199:3000/public/images/${gameSafeString}/achievements/special/_.jpeg`
				}

				loaded = true
			}
		}, index * 50)
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

{#if loaded === true}

	<img {src} {isGrey} alt="" on:error={() => fixError()} />
{:else}
	<ImagePlaceHolder />
{/if}

<style>
	img {
		width: 4rem;
		height: 4rem;
		max-width: 4rem;
		max-height: 4rem;
		min-width: 3rem;
		min-height: 3rem;

		z-index: 1;
		grid-area: 1 / 1 / span 2 / 1;
	}

	img[isGrey='true'] {
		filter: grayscale(1) brightness(0.5);
	}
</style>
