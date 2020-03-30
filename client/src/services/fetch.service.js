import fetch from 'node-fetch'

const protocol = 'http://'
const domain = '192.168.1.199'
const port = '3000'
const fullUrl = `${protocol}${domain}:${port}`

const baseSteamUrl = 'https://steamcdn-a.akamaihd.net/steam/apps/'

export const steamImageUrls = {
	header: appid => `${baseSteamUrl}${appid}/header.jpg`,
	smallCapsule: appid => `${baseSteamUrl}${appid}/capsule_sm_120.jpg`,
	bigCapsule: appid => `${baseSteamUrl}${appid}/capsule_616x353.jpg`,
	logo: appid => `${baseSteamUrl}${appid}/logo.png`,
	hero: appid => `${baseSteamUrl}${appid}/library_hero.jpg`,
	library: appid => `${baseSteamUrl}${appid}/library_600x900.jpg`,
	background: (appid, backgroundUrl) => `${baseSteamUrl}${appid}/${backgroundUrl}`,
	achievement: (appid, achievementId) => `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${achievementId}`,
}

export function get(url) {
	return new Promise((resolve, reject) => {
		try {
			fetch(`${fullUrl}/${url}`)
				.then(async response => {
					let status = response['status']
					let responseDetails = JSON.parse(response['headers'].get('Response-Details'))
					let contentType = response['headers'].get('Content-Type')

					if (status === 204) {
						resolve({ status, details: responseDetails })
					} else if (status === 200) {
						if (contentType.includes('application/json')) {
							let data = await response.json()
							resolve({ status, ...data })
						}
					}
				})
				.catch(err => {
					throw new Error(err)
				})
		} catch (error) {
			reject(error)
		}
	})
}

export function fetchImage(appid, imageType, id) {
	return new Promise((resolve, reject) => {
		try {
			if (imageType === 'achievement') {
				fetch(`${fullUrl}/image/${imageType}/${appid}/${id}`).then(async response => {
					processResponse(response)
				})
			} else {
				fetch(`${fullUrl}/image/${imageType}/${appid}`).then(async response => {
					processResponse(response)
				})
			}

			async function processResponse(response) {
				const contentType = response.headers.get('Content-Type')

				if (contentType === 'plain/text') {
					resolve(await response.text())
				} else if (contentType === 'image/webp') {
					resolve(response['url'])
				}
			}
		} catch (error) {
			reject(error)
		}
	})
}

export default {
	get,
	fetchImage,
}
