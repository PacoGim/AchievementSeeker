import { ParameterizedContext } from 'koa'

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
function getCacheUrl(ctx: ParameterizedContext): string | undefined {
	let data = urlCache[ctx['url'].toLowerCase()]

	if (data !== undefined) {
		return data
	} else {
		return undefined
	}
}

/**
 * Sets data to cached by url {key}.
 *
 * @param {string} keyUrl
 * @param {string} urlData
 */
function setCacheUrl(ctx: ParameterizedContext) {
	if (ctx['body'] !== undefined) urlCache[ctx['url'].toLowerCase()] = ctx['body']
}

export { getCacheUrl, setCacheUrl }
