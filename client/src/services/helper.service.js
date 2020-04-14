export function supportsWebp() {
	return new Promise(async (resolve, reject) => {
		if (!self.createImageBitmap) {
			globalThis.supportsWebp = false
			return resolve(globalThis.supportsWebp)
		}

		const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
		const blob = await fetch(webpData).then((r) => r.blob())
		createImageBitmap(blob)
			.then(
				() => {
					// globalThis.supportsWebp = false
					globalThis.supportsWebp = true
				},
				() => {
					globalThis.supportsWebp = false
				}
			)
			.finally(() => resolve(globalThis.supportsWebp))
	})
}

export function parseDate(date) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	date = new Date(date)
	let day = date.getUTCDate()
	let month = months[date.getUTCMonth()]
	let year = date.getUTCFullYear()
	let indicator = ['st', 'nd', 'rd', 'th'][day > 3 ? 3 : day - 1]

	return `${day}${indicator} ${month}, ${year}`
}

export function parseDateReduced(date) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	date = new Date(date)
	let day = date.getUTCDate()
	let month = months[date.getUTCMonth()]
	let year = date.getUTCFullYear()
	let indicator = ['st', 'nd', 'rd', 'th'][day > 3 ? 3 : day - 1]

	return `${day}/${month}/${String(year).substring(2)}`
}

export function getCookiesAsJson() {
	return JSON.parse(
		'{' +
			document.cookie.split('; ').map((x) => {
				return `"${x.split('=')[0]}":"${x.split('=')[1]}"`
			}) +
			'}'
	)
}
