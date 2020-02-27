<script>
	import { supportsWebp } from '../../services/helper.service.js'
	import { fetchImage, steamImageUrls } from '../../services/fetch.service.js'
	import { onMount } from 'svelte'

	export let appid
	export let imageType
	export let klass = undefined
	let src

	$: {
		;(async () => {
			if (window.supportsWebp === undefined) {
				await supportsWebp()
			}

			if (window.supportsWebp === false) {
				src = steamImageUrls[imageType](appid)
			} else if (window.supportsWebp === true) {
				fetchImage(appid, imageType).then(response => {
					src = response
				})
			}
		})()
	}

	function imageLoadingError() {
		console.log(appid, imageType, ' Not Found')
	}
</script>

<img {src} class={klass} on:error={() => imageLoadingError()} loading="lazy" alt="" />

<style lang="scss">
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
</style>
