export function isWebpSupported() {
	return new Promise(async resolve => {
		if (window.isWebpSupported === undefined) {
			// console.log('Checking WebP support...')
			if (!self.createImageBitmap) return false
			const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
			const blob = await fetch(webpData).then(r => r.blob())
			let isWebpSupported = await createImageBitmap(blob).then(() => true, () => false)

			// window.isWebpSupported = false
			window.isWebpSupported = isWebpSupported

			// isWebpSupported ? console.log('This browser supports Webp.') : console.log("This browser doesn't support Webp :(")

			// resolve(false)
		}

		resolve(window.isWebpSupported)
	})
}

export function genNum(min, max) {
	return Number(Math.floor(Math.random() * (max - min + 1) + min))
}

export function fetchImageBase64(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => res.text())
			.then(imageBase64 => resolve(imageBase64))
	})
}

export function fetchImageArrayBuffer(url) {
	return new Promise((resolve, reject) => {
		fetch(url).then(async res => {
			if (res['headers'].get('Content-Type') === 'text/plain') {
				resolve(await res.text())
			} else {
				res.arrayBuffer().then(imageBuffer => {
					const arrayBufferView = new Uint8Array(imageBuffer)
					const blob = new Blob([arrayBufferView], { type: 'image/webp' })
					const urlCreator = window.URL || window.webkitURL
					const imageUrl = urlCreator.createObjectURL(blob)
					resolve(imageUrl)
				})
			}
		})
	})
}

export function fetchImageBuffer(url) {
	return new Promise(async (resolve, reject) => {
		const imageBuffer = await fetch(url)
			.then(res => res.arrayBuffer())
			.catch(err => {
				console.log('Error', err)
			})
		resolve(imageBuffer)
	})
}

export function imageArrayBufferToUrl(buffer) {
	return new Promise((resolve, reject) => {
		const arrayBufferView = new Uint8Array(buffer)
		const blob = new Blob([arrayBufferView])
		const urlCreator = window.URL || window.webkitURL
		const imageUrl = urlCreator.createObjectURL(blob)
		resolve(imageUrl)
	})
}