<script>
	import { supportsWebp } from '../../services/helper.service.js'
	import { fetchImage, steamImageUrls } from '../../services/fetch.service.js'
	import { onMount } from 'svelte'

	export let appid
	export let imageType
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

<img {src} on:error={() => imageLoadingError()} alt="" />

<style lang="scss">

	img{
		height: 3.5rem;
		width:auto;
	}

</style>