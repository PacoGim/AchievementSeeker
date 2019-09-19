let cache = {}

export function setCache(urlKey, data) {
	cache[urlKey] = data
}

export function getCache(urlKey) {
	return cache[urlKey]
}
