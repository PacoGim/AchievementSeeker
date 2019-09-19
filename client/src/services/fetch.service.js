import { setCache, getCache } from 'services/cache.service.js'

export function fetchImage(url) {
	return new Promise((resolve, reject) => {
		if (getCache(url) !== undefined) {
			resolve(getCache(url))
		} else {
			fetch(url).then(async res => {
				let contentType = res.headers.get('Content-Type')

				if (contentType === 'image/webp') {
					const arrayBufferView = new Uint8Array(await res.arrayBuffer())
					const blob = new Blob([arrayBufferView], { type: 'image/webp' })
					const urlCreator = window.URL || window.webkitURL
					const imageUrl = urlCreator.createObjectURL(blob)
					resolve(imageUrl)

					setCache(url, imageUrl)
				} else {
					resolve(await res.text())
				}
			})
		}
	})
}
