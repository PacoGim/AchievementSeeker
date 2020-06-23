<script>
	import { supportsWebp } from '../../services/helper.service.js'
	import { fetchImage, steamImageUrls } from '../../services/fetch.service.js'
	import { onMount } from 'svelte'

	export let appid
	export let imageType
	export let klass = undefined
	export let alt
	export let achId = undefined

	let src

	$: {
		appid
		if (process.browser === true) {
			loadImage()
		}
	}

	function imageLoadingError() {
		if (imageType === 'hero') {
			imageType = 'background'
			loadImage()
		}
	}

	async function loadImage() {
		if (globalThis.supportsWebp === undefined) {
			await supportsWebp()
		}

		if (imageType === 'achievement') {
			if (globalThis.supportsWebp === false) {
				fetchImage(appid, 'steamAchievement', achId).then(response => {
					src = response
				})
			} else if (globalThis.supportsWebp === true) {
				fetchImage(appid, imageType, achId).then(response => {
					src = response
				})
			}
		} else {
			if (globalThis.supportsWebp === false) {
				src = steamImageUrls[imageType](appid)
			} else if (globalThis.supportsWebp === true) {
				fetchImage(appid, imageType).then(response => {
					src = response
				})
			}
		}
	}
</script>

<img {src} class={klass} on:error={() => imageLoadingError()} {alt} />

<style lang="scss">
	img {
		position: relative;
	}
	img.listGame {
		height: auto;
		width: 100%;
		min-width: 10rem;
		max-width: 10rem;
	}

	img.searchGame {
		height: 100%;
		width: auto;
	}

	img.gamePageHero {
		width: 30vw;
		height: auto;
	}
	img.gamePageLogo {
		height: 100px;
		width: auto;
		align-self: end;
	}

	img[alt]:after {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		content: attr(alt);
	}
</style>
