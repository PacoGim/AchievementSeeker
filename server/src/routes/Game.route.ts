import Router from 'koa-router'

import koaBody from 'koa-body'

import {GameCollection} from '../database/collections/Game.collection'

import { setCacheUrl } from '../utils/url-cache'
import { GameType } from '../types/Game.type'
import { getGameById, getModularGames, getGamesList } from '../models/Game.model'

const router = new Router({ prefix: '/games' })

router.options('/', (ctx) => {
	if (ctx['req']['headers']['access-control-request-method'] === 'POST') {
		ctx['status'] = 204
	} else {
		ctx['status'] = 400
	}
})

router.post('/', koaBody(), async (ctx) => {
	let options = ctx['request']['body']

	if (typeof options !== 'object') {
		ctx['status'] = 200
		return (ctx['body'] = 'Submit a valid JSON type POST request.')
	}

	let games = await getModularGames(options).catch((error) => {
		return (ctx['body'] = error['message'])
	})

	if (games.length !== 0) {
		ctx['body'] = games
	} else {
		ctx['status'] = 204
		return ctx.set(
			'Response-Details',
			JSON.stringify({
				message: `No games found.`
			})
		)
	}
})

router.get('/search/:query/:limit', async (ctx) => {
	let limit: number | undefined = Number(ctx['params']['limit'])
	let query: string | undefined = ctx['params']['query']

	interface IResponseObject {
		details?: any
		data: GameType[] | undefined
	}

	let responseObject: IResponseObject = {
		data: undefined
	}

	if (query) {
		let foundGamesArray: GameType[] = []

		let regAlias: RegExp = RegExp(`${query}`, 'i')
		let regName: RegExp = RegExp(`${query}`, 'i')

		let gamesSearchName: GameType[] = await GameCollection
			.find({ name: { $regex: regName } })
			.project({ name: 1, _id: 1, appid: 1, alias: 1 })
			.toArray()

		let gamesSearchAlias: GameType[] = await GameCollection
			.find({ alias: { $in: [regAlias] } })
			.project({ name: 1, _id: 1, appid: 1, alias: 1 })
			.toArray()

		gamesSearchName = gamesSearchName.filter((a) => !gamesSearchAlias.find((b) => a['_id'] === b['_id']))

		foundGamesArray = gamesSearchAlias.concat(gamesSearchName)

		if (limit !== undefined) {
			responseObject['details'] = { totalFound: foundGamesArray.length }
			responseObject['data'] = foundGamesArray.slice(0, limit)
		} else {
			responseObject['data'] = foundGamesArray
		}

		if (foundGamesArray.length > 0) {
			ctx['body'] = responseObject
			ctx['status'] = 200
		} else {
			ctx['status'] = 204
			ctx.set('Response-Details', '{ "msg": "No Games found" }')
		}
	}
})

router.get('/genres', async (ctx) => {
	const genres = await GameCollection.distinct('genres')
	if (genres !== undefined && genres.length > 0) {
		ctx['status'] = 200
		ctx['body'] = genres
		setCacheUrl(ctx)
	} else {
		ctx['status'] = 204
	}
})

router.get('/list', async (ctx) => {
	let gamesList = await getGamesList()

	if (gamesList !== undefined) {
		ctx['body'] = gamesList
	} else {
		ctx['status'] = 204
	}
})

router.get('/:id', async (ctx) => {
	let id = ctx['params']['id']

	let game = await getGameById(id)

	if (game !== undefined) {
		ctx['status'] = 200
		ctx['body'] = game
	} else {
		ctx['status'] = 204
		ctx.set(
			'Response-Details',
			JSON.stringify({
				message: `Game with ID or AppID ${id} not found.`
			})
		)
	}
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
