import { set, get } from 'idb-keyval'

/**
 * @export
 * @param {string} key
 */
export function getCachedData(key) {
	return new Promise((resolve, reject) => {
		get(key)
			.then(data => {
				if (data !== undefined) {
					const currentTime = new Date().getTime()
					const timeDiff = data['expiresOn'] - currentTime

					if (timeDiff <= 0) {
						return reject({
							message: 'Data expired',
							code: 'ErrExpiredData',
						})
					} else {
						return resolve(data)
					}
				} else {
					return reject({
						message: 'Data not cached',
						code: 'ErrNotCachedData',
					})
				}
			})
			.catch(error =>
				reject({
					message: error,
					code: 'ErrNotCovered',
				})
			)
	})
}

/**
 *
 * @param {string} key
 * @param {any} data
 */
export function setCachedData(key, data) {
	return new Promise((resolve, reject) => {
		set(key, data)
			.then(() =>
				resolve({
					message: `${key} data cached successfully`,
					code: 'OkDataCached',
				})
			)
			.catch(err =>
				reject({
					message: `Could't cache ${key} because: ${err}`,
					code: 'ErrNotCovered',
				})
			)
	})
}

export const ONEDAY = 24 * 60 * 60 * 1000
