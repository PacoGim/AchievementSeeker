function supportsWebp() {
	return new Promise(async resolve => {
		console.log('Checking WebP support...')
		if (!self.createImageBitmap) return false
		const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
		const blob = await fetch(webpData).then(r => r.blob())
		let supportsWebp = await createImageBitmap(blob).then(() => true, () => false)

		// window.supportsWebp = false
		window.supportsWebp = supportsWebp

		supportsWebp ? console.log('This browser supports Webp.') : console.log("This browser doesn't support Webp :(")

		// resolve(false)
		resolve(supportsWebp)
	})
}

function fetchImageBase64(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => res.text())
			.then(imageBase64 => resolve(imageBase64))
	})
}

function fetchImageArrayBuffer(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => res.arrayBuffer())
			.then(imageBuffer => {
				const arrayBufferView = new Uint8Array(imageBuffer)
				const blob = new Blob([arrayBufferView], { type: 'image/jpeg' })
				const urlCreator = window.URL || window.webkitURL
				const imageUrl = urlCreator.createObjectURL(blob)
				resolve(imageUrl)
			})
	})
}

export { supportsWebp, fetchImageBase64, fetchImageArrayBuffer }
