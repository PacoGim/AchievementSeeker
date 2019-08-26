let cache = {}

setInterval(() => {
	console.log('Resetting Cache...')
	cache = {}
}, 12 * 60 * 60 * 1000)

function getCache() {
	return cache
}

function setCache(key, value) {
	cache[key] = value
	return cache
}

module.exports = { getCache, setCache }
