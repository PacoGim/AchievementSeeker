import { genNum, isWebpSupported, fetchImageBuffer, imageArrayBufferToUrl } from 'helpers/functions.js'

function getGameBackground(id, appid, backgrounds) {
	return new Promise(async (resolve, reject) => {
		console.log('Loading BG')
		if (window.isWebpSupported === undefined) {
			await isWebpSupported()
		}

		let fetchUrl = ''

		if (window.isWebpSupported) {
			fetchUrl = `http://localhost:443/images/background/${id}`
		} else {
			fetchUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/${backgrounds[genNum(0, backgrounds.length - 1)]}`
		}

		fetch(fetchUrl).then(async res => {
			console.log('Bg Fetched')

			const contentType = res['headers'].get('Content-Type')

			let imageArrBuff

			if (contentType === 'text/plain') {
				const url = await res.text()
				imageArrBuff = await fetchImageBuffer(url)
			} else {
				imageArrBuff = await res.arrayBuffer()
			}

			const imageUrl = await imageArrayBufferToUrl(imageArrBuff)

			resolve(imageUrl)
		})
	})
}

function getGameLogo(id) {
	// http://localhost:443/games/logo/pt6Sr89j06gkS/false
	// image/webp Status: 200
	// image/png Status: 200
	// application/json {"err": "No logo available"} Status: 404

	return new Promise(async (resolve, reject) => {
		if (window.isWebpSupported === undefined) {
			await isWebpSupported()
		}

		fetch(`http://localhost:443/games/logo/${id}/${window.isWebpSupported}`).then(async res => {
			// const contentType = res['headers'].get('Content-Type')
			const status = res['status']

			if (status === 200) {
				const imageArrBuff = await res.arrayBuffer()
				const imageUrl = await imageArrayBufferToUrl(imageArrBuff)

				resolve(imageUrl)
			} else {
				reject({ err: 'LogoNotAvailable' })
			}
		})
	})
}

export { getGameBackground, getGameLogo }
