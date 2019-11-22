import { setCache, getCache } from 'services/cache.service.js'
import { areObjectsEqual } from "services/helper.service.js"
import fetch from "node-fetch";

const serverURL = `http://localhost:4000`

let previousQuery = {}
let previousResponse = undefined

export function gqlFetch(query) {
	return new Promise(async (resolve, reject) => {

		// If the current request is identical to the previous one, it simply gives back the saved response from the previous request.
		if (areObjectsEqual(previousQuery, query)) {
			resolve(previousResponse)
		} else {
			let response = await fetch(`${serverURL}/graphql?query=${query}`).then(res => res.json()).catch(err => {
				reject(err)
			})

			if (response !== undefined) {
				previousQuery = query
				previousResponse = response

				resolve(response)
			}
		}
	})
}

export function fetchServer(url) {
	return new Promise((resolve, reject) => {
		fetch(`${serverURL}${url}`)
			.then(res => res.json())
			.then(data => {
				resolve(data)
			});
	})
}

export function fetchGameHeaderImage(gameID) {
	return new Promise((resolve, reject) => {

		fetch(`${serverURL}/images/header/${gameID}`)
			.then(res => {
				const contentType = res.headers.get('Content-Type')

				if (contentType === 'image/webp') {
					res.arrayBuffer().then(imageBuffer => {
						const arrayBufferView = new Uint8Array(imageBuffer)
						const blob = new Blob([arrayBufferView], { type: 'image/webp' })
						const urlCreator = window.URL || window.webkitURL
						const imageUrl = urlCreator.createObjectURL(blob)
						resolve(imageUrl)
					})
				} else {
					res.text().then(imageUrl => resolve(imageUrl))
				}
			})
	})
}

export function fetchImage(url) {
	return new Promise((resolve, reject) => {
		if (getCache(url) !== undefined) {
			resolve(getCache(url))
		} else {
			fetch(url).then(async res => {
				let contentType = res.headers.get('Content-Type')

				if (contentType === 'image/webp') {
					const arrayBufferView = new Uint8Array(await res.arrayBuffer())
					const blob = new Blob([arrayBufferView], { type: 'image/webp' })
					const urlCreator = window.URL || window.webkitURL
					const imageUrl = urlCreator.createObjectURL(blob)
					resolve(imageUrl)

					setCache(url, imageUrl)
				} else {
					resolve(await res.text())
				}
			})
		}
	})
}
