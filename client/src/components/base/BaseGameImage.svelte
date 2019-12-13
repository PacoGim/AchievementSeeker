<script>
	import { onMount } from 'svelte'

	import { fetchGameImage } from 'services/fetch.service.js'
	import { isWebpSupported } from 'services/helper.service.js'

	export let gameId
	export let appid
	export let styleClass
	export let imageType = 'header'
	export let imageFallback = 'header'
	export let padding = undefined
	export let margin = undefined
	let isImageLoaded = false
	let imageUrl

	$: {
		isImageLoaded = false
		gameId
		loadImage()
	}

	async function loadImage() {
		if (process.browser === true) {
			if (window.isWebpSupported === undefined) await isWebpSupported()

			if (window.isWebpSupported === true) {
				fetchGameImage(gameId, imageType).then(imageData => (imageUrl = imageData))
			} else {
				if (imageType === 'header') {
					imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
				} else if (imageType === 'hero') {
					imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/library_hero.jpg`
				} else if (imageType === 'capsule') {
					imageUrl = ` https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`
				} else if (imageType === 'bigCapsule') {
					imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_616x353.jpg`
				} else if (imageType === 'library') {
					imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/library_600x900.jpg`
				} else if (imageType === 'logo') {
					imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/logo.png`
				}
			}
		}
	}

	function imageLoadingError() {
		fetchGameImage(gameId, imageFallback).then(imageData => (imageUrl = imageData))
	}
</script>

<img {padding} {margin} class={styleClass} on:error={() => imageLoadingError()} on:load={() => (isImageLoaded = true)} loaded={isImageLoaded} src={imageUrl} alt="" />

<style lang="scss">
	img {
		display: block;

		&[loaded] {
			transition: opacity .3s ease-in-out;
		}

		&[loaded='false'] {
			opacity: 0;
		}

		&[loaded='true'] {
			opacity: 1;
		}
	}

	img.game-card-image {
		height: 120px;
		min-width: 256.75px;
	}

	img.game-search-image {
		height: 40px;
	}

	img.auto-width {
		width: 100%;
		height: auto;
	}

	img.auto-height {
		width: auto;
		height: 100%;
	}

	img.game-list-image {
		// height: 60px;
		// min-height: 60px;
		max-height: 4rem;
		width: auto;
		border-top-left-radius: 5px;
		border-bottom-right-radius: 5px;
		grid-column: 1;
		grid-row: 1 / span 3;
	}
</style>
