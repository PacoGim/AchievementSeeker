import Router from 'koa-router'
import send from 'koa-send'
import fs from 'fs-extra'
import path from 'path'
import fetch from 'node-fetch'
import sharp from 'sharp'

import { genNum, hashCode } from '../helpers/functions'

import { getCustomGame } from '../models/Game.model'

const router = new Router({ prefix: '/images' })

// GET - Params: type: string, id:string
router.get('/:type/:id', async ctx => {
	// console.log(ctx['headers'])
	// ctx.set('Cache-Control', 'public, max-age=604421')

	let { type, id }: { type: string; id: string } = ctx['params']

	// Directory where the file is going to be saved.
	let dirPath: string = path.join(path.resolve(), '/server/public/images', id)

	// Full path of the file. Directory + filename + extension.
	let fullPath: string = ''

	// To be fetched url where the required ressource is located.
	let fetchUrl: string = ''

	// Checking the type of image the request is asking for. Header or Background
	if (type === 'header') {
		// Setting the full path of the header.
		fullPath = path.join(dirPath, '/header.webp')

		// If the header image doesn't exist then
		if (!fs.existsSync(fullPath)) {
			// Fetches the game from the db by _id. Gets only the appid.
			let { appid } = await getCustomGame({ filter: { _id: id }, project: { appid: 1 } })

			//Sets the header fetching url.
			fetchUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`
		}
	}

	if (type === 'background') {
		// Fetches the game by _id. Gets only the appid and backgrounds.
		let { appid, backgrounds } = await getCustomGame({ filter: { _id: id }, project: { appid: 1, backgrounds: 1 } })

		// Takes a random background from the background array of the game object.
		let background: string = backgrounds[genNum(0, backgrounds.length - 1)]

		// Hashes the background name to have an uniform name every time. 8q4gf4w1n4u8e21s8g1 => 0LXHL87X2P
		let name: string = hashCode(background)

		// Sets the backgrounds directory path.
		dirPath = path.join(dirPath, '/backgrounds')

		// Sets the background path.
		fullPath = path.join(dirPath, `${name}.webp`)

		// Sets the fetching background url.
		fetchUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/${background}`
	}

	// If the requested image doesn't exist.
	if (!fs.existsSync(fullPath)) {
		// Fetches the image based on the fetchUrl and saves it to the full path.
		// Dir path is required to create the folder structure.
		ctx.set('Content-Type', 'plain/text')
		ctx.body = fetchUrl
		fetchAndSaveImage(fetchUrl, dirPath, fullPath)
	} else {
		ctx.set('Content-Type', 'image/webp')
		// Sends back to the user the raw image.
		await send(ctx, fullPath, { root: '/' })
	}
})

// GET - Params: id: string, achievementId: number, isGray?: string
router.get('/achievement/:id/:achievementId/:isGray*', async ctx => {
	// ctx.set('Cache-Control', 'public, max-age=604421')

	let { id, achievementId, isGray }: { id: string; achievementId: number; isGray: string } = ctx['params']
	achievementId = Number(achievementId)

	let { achievements, appid } = await getCustomGame({ filter: { _id: id }, project: { 'achievements._id': 1, 'achievements.img': 1, 'achievements.imgGray': 1, appid: 1 } })

	let achievement = achievements.find(i => i['_id'] === achievementId)

	if (achievement) {
		let dirPath: string = path.join(path.resolve(), '/server/public/images', id, '/achievements')
		let fullPath: string = isGray === undefined ? path.join(dirPath, `${achievement['_id']}.webp`) : path.join(dirPath, `${hashCode(achievement['imgGray'])}.gray.webp`)

		if (!fs.existsSync(fullPath)) {
			let fetchUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${isGray === undefined ? achievement['img'] : achievement['imgGray']}`

			ctx.set('Content-Type', 'plain/text')
			ctx.body = fetchUrl

			fetchAndSaveImage(fetchUrl, dirPath, fullPath)
		} else {
			await send(ctx, fullPath, { root: '/' })
		}
	}
})

function fetchAndSaveImage(url: string, dirPath: string, savePath: string) {
	return new Promise((resolve, reject) => {
		fs.mkdirpSync(dirPath)

		fetch(url)
			.then(res => res.arrayBuffer())
			.then(arrayBuffer => {
				sharp(Buffer.from(arrayBuffer))
					.webp({ quality: 80 })
					.toFile(savePath, (err, info) => {
						resolve()
					})
			})
	})
}

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
