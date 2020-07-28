import fetch from 'node-fetch'

import { supportsWebp } from '../services/helper.service'

const protocol = 'http://'
const domain = '192.168.1.199'
const port = '3000'
const baseUrl = `${protocol}${domain}:${port}`

const baseSteamUrl = 'https://steamcdn-a.akamaihd.net/steam/apps/'

export const steamImageUrls = {
	header: (appid) => `${baseSteamUrl}${appid}/header.jpg`,
	smallCapsule: (appid) => `${baseSteamUrl}${appid}/capsule_sm_120.jpg`,
	bigCapsule: (appid) => `${baseSteamUrl}${appid}/capsule_616x353.jpg`,
	logo: (appid) => `${baseSteamUrl}${appid}/logo.png`,
	hero: (appid) => `${baseSteamUrl}${appid}/library_hero.jpg`,
	library: (appid) => `${baseSteamUrl}${appid}/library_600x900.jpg`,
	background: (appid, backgroundUrl) => `${baseSteamUrl}${appid}/${backgroundUrl}`,
	achievement: (appid, achievementId) => `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${achievementId}`
}

export function get(url) {
	return new Promise((resolve, reject) => {
		try {
			fetch(`${baseUrl}/${url}`)
				.then(async (res) => {
					let status = res['status']
					let responseDetails = JSON.parse(res['headers'].get('Response-Details'))
					let contentType = res['headers'].get('Content-Type')

					if (status === 204) {
						resolve({ status, details: responseDetails })
					} else if (status === 200) {
						if (contentType.includes('application/json')) {
							let data = await res.json()
							resolve({ status, ...data })
						}
					}
				})
				.catch((err) => {
					throw new Error(err)
				})
		} catch (error) {
			reject(error)
		}
	})
}

export function postWithCredentials(endpoint) {
	return new Promise((resolve, reject) => {
		fetch(`${baseUrl}/${endpoint}`, {
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((res) => resolve(res))
	})
}

export function post(url, body) {
	return new Promise((resolve, reject) => {
		try {
			fetch(`http://192.168.1.199:3000/${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
				.then((res) => {
					if (res['status'] === 200) {
						let contentType = res['headers'].get('Content-Type')

						if (contentType.includes('text/plain')) {
							return res.text()
						} else if (contentType.includes('application/json')) {
							return res.json()
						}
					}

					if (res['status'] === 204) {
						return reject(res.headers.get('Response-Details'))
					}
				})
				.then((data) => {
					resolve(data)
				})
		} catch (error) {}
	})
}

export function fetchAchievementImage(gameId, achId, isAchieved) {
	return new Promise(async (resolve, reject) => {
		let endpoint = isAchieved ? `${gameId}/${achId}` : `${gameId}/${achId}/true`

		if (globalThis.supportsWebp === undefined) {
			await supportsWebp()
		}

		if (globalThis.supportsWebp === true) {
			fetch(`${baseUrl}/image/achievement/${endpoint}`).then(async (res) => {
				const contentType = res.headers.get('Content-Type')

				if (contentType.includes('text/plain')) {
					resolve(await res.text())
				} else if (contentType.includes('image/webp')) {
					resolve(URL.createObjectURL(await res.blob()))
				}
			})
		} else {
			let imageSrc = await fetch(`${baseUrl}/image/steamAchievement/${endpoint}`).then((res) => res.text())
			resolve(imageSrc)
		}
	})
}

export function fetchImage(appid, imageType, id) {
	return new Promise((resolve, reject) => {
		try {
			if (imageType === 'achievement' || imageType === 'steamAchievement') {
				fetch(`${baseUrl}/image/${imageType}/${appid}/${id}`).then(async (res) => {
					processResponse(res)
				})
			} else {
				fetch(`${baseUrl}/image/${imageType}/${appid}`).then(async (res) => {
					processResponse(res)
				})
			}

			async function processResponse(res) {
				const contentType = res.headers.get('Content-Type')
				if (contentType.includes('text/plain')) {
					resolve(await res.text())
				} else if (contentType.includes('image/webp')) {
					resolve(URL.createObjectURL(await res.blob()))
				}
			}
		} catch (error) {
			reject(error)
		}
	})
}

export default {
	get,
	post,
	postWithCredentials,
	fetchImage,
	fetchAchievementImage
}
