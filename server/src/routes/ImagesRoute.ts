import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import send from 'koa-send'
import fs from 'fs-extra'
import path from 'path'
import fetch from 'node-fetch'
import sharp from 'sharp'

import { genNum, hashCode } from '../helpers/functions'

// import { getCustomGame } from '../models/GameModel'
import GameCollection from '../db/collections/GameCollection'
import { IAchievement } from '../entities/AchievementEntity'

const router = new Router({ prefix: '/images' })

// GET - Params: type: string, id:string
router.get('/:type/:id', async (ctx: ParameterizedContext) => {

	// ctx.set('Cache-Control', 'public, max-age=604421')

	let { type, id }: { type: string; id: string } = ctx['params']

	// Fetches the game from the db by _id.
	let game = await GameCollection.get().findOne({ _id: id })

	if (!game) {
		ctx.status = 404
		ctx.set('Content-Type', 'application/json')
		ctx.body = { status: ctx.status, msg: `Game with id: ${id} does not exist.` }
		return
	}

	// Directory where the file is going to be saved.
	let dirPath: string = path.join(path.resolve(), '/server/public/images', `${getSafeFolderName(id,game['name'])}`)

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
			//Sets the header fetching url.
			fetchUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/header.jpg`
		}
	} else if (type === 'background') {
		// Fetches the game by _id. Gets only the appid and backgrounds.
		// let game = await GameCollection.get().findOne({ _id: id })

		// if (!game) {
		// 	ctx.status = 404
		// 	ctx.set('Content-Type', 'application/json')
		// 	ctx.body = { status: ctx.status, msg: `Game with id: ${id} does not exist.` }
		// 	return
		// }

		let { appid, backgrounds } = game

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
	} else {
		ctx.status = 400
		ctx.set('Content-Type', 'application/json')
		ctx.body = { status: ctx.status, msg: `Endpoint not found.${type === 'achievement' ? ' Seems like you might have forgotten the Achievement ID' : ''}` }

		return
	}

	// If the requested image doesn't exist.
	if (!fs.existsSync(fullPath)) {
		// Fetches the image based on the fetchUrl and saves it to the full path.
		// Dir path is required to create the folder structure.
		ctx.set('Content-Type', 'plain/text')
		ctx.body = fetchUrl

		// While the client gets an url, the backend Downloads, Converts and Saves the image for the next resquests.
		fetchAndSaveImage(fetchUrl, dirPath, fullPath).catch()
	} else {
		ctx.set('Content-Type', 'image/webp')

		ctx.set('Cache-Control','max-age=604800')

		// Sends back to the user the raw image.
		await send(ctx, fullPath, { root: '/' })
	}
})

// GET - Params: id: string, achievementId: number, isGray?: string
router.get('/achievement/:id/:achievementId/:isGray*', async (ctx: ParameterizedContext) => {
	// ctx.set('Cache-Control', 'public, max-age=604421')
	let { id, achievementId, isGray }: { id: string; achievementId: number; isGray: string } = ctx['params']
	achievementId = Number(achievementId)

	// Fetches game from db.
	let game = await GameCollection.get().findOne({ _id: id })

	if (!game) {
		ctx.status = 404
		ctx.set('Content-Type', 'application/json')
		ctx.body = { status: ctx.status, msg: `Game with id: ${id} does not exist.` }
		return
	}

	let { achievements, appid } = game

	if (achievements) {
		// Looks for the achievement the client is requesting in the game achievements array.
		let achievement = achievements.find((i: IAchievement) => i['_id'] === achievementId)

		// If an achievement was found.
		if (achievement) {
			// Sets the directory path.
			let dirPath: string = path.join(path.resolve(), '/server/public/images', `${getSafeFolderName(id,game['name'])}`, '/achievements')

			// Sets the final image path.
			let fullPath: string = isGray === undefined ? path.join(dirPath, `${achievement['_id']}.webp`) : path.join(dirPath, `${hashCode(achievement['imgGray'])}.gray.webp`)

			// If the full path doesn't exist.
			if (!fs.existsSync(fullPath)) {
				// Url where the ressource is located.
				let fetchUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${isGray === undefined ? achievement['img'] : achievement['imgGray']}`

				ctx.status = 200
				ctx.set('Content-Type', 'plain/text')
				ctx.body = fetchUrl

				// While the client gets an url, the backend Downloads, Converts and Saves the image for the next resquests.
				fetchAndSaveImage(fetchUrl, dirPath, fullPath).catch()
			} else {
				ctx.status = 200
				ctx.set('Content-Type', 'image/webp')
				await send(ctx, fullPath, { root: '/' })
			}
		} else {
			ctx.status = 404
			ctx.set('Content-Type', 'application/json')
			ctx.body = { status: ctx.status, msg: `Achievement ${achievementId} not found.` }
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
			.catch(err => {
				reject(err)
			})
	})
}

function getSafeFolderName(id:string,name: string) {
	return `${name.replace(/[^a-zA-Z0-9]+/g, "")}-${id}`
}

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
