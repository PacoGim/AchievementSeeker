let urlCache: { [index: string]: string } = {}

setInterval(() => {
	console.log('Resetting Cache...')
	urlCache = {}
}, 12 * 60 * 60 * 1000)

/**
 * Gets cached URL data.
 *
 * @param {string} url
 * @returns {string}
 */
function getCacheUrl(keyUrl: string): string | undefined {
	if (urlCache[keyUrl] !== undefined) return urlCache[keyUrl]
	else return undefined
}

/**
 * Sets data to cached by url {key}.
 *
 * @param {string} keyUrl
 * @param {string} urlData
 */
function setCacheUrl(keyUrl: string, urlData: string) {
	if (urlCache[keyUrl] === undefined) urlCache[keyUrl] = urlData
}

export { getCacheUrl, setCacheUrl }
