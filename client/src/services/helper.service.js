export function supportsWebp() {
	return new Promise(async (resolve, reject) => {
		if (!self.createImageBitmap) {
			window.supportsWebp = false
			return resolve(window.supportsWebp)
		}

		const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
		const blob = await fetch(webpData).then(r => r.blob())
		createImageBitmap(blob).then(
			() => {
				// window.supportsWebp = false
				window.supportsWebp = true
			},
			() => {
				window.supportsWebp = false
			}
		).finally(()=> resolve(window.supportsWebp))
	})
}
