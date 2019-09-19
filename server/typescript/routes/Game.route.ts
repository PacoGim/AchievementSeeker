import Router from 'koa-router'
import koaBody from 'koa-body'

const router = new Router({ prefix: '/games' })

import { getGame, getCustomGames, getGameList } from '../models/Game.model'

import { setCacheUrl } from '../url-cache'

router.get('/list', async ctx => {
	let games

	const reqUrl = ctx['req']['url'] || ''

	games = await getGameList()

	setCacheUrl(reqUrl, JSON.stringify(games))

	ctx.body = games
})

router.post('/customGames', koaBody(), async ctx => {
	let options = ctx['request']['body']

	try {
		options = JSON.parse(options)
	} catch {}

	let games = await getCustomGames(options).catch((err: Error) => {
		ctx.status = 400
		ctx.body = err
	})

	ctx.status = 200
	ctx.body = games
})

router.get('/:id/:options', async ctx => {
	const reqUrl = ctx['req']['url'] || ''

	let { id, options } = ctx['params']
	options = options.split(',')

	let project: { [index: string]: number } = {}

	for (let option of options) {
		project[option] = 1
	}

	const games = await getCustomGames({
		filter: {
			_id: id,
		},
		project,
	})

	const game = games[0]

	if (!game) {
		ctx.status = 404
		ctx.body = { err: `The id:${id} doesn\'t match any game.` }
	} else {
		ctx.status = 200
		ctx.body = game
	}

	setCacheUrl(reqUrl, JSON.stringify(game))
})

router.get('/:id', async ctx => {
	const reqUrl = ctx['req']['url'] || ''

	const id = ctx['params']['id']
	const game = await getGame(id).catch(err => console.log(err))

	if (!game) {
		ctx.status = 404
		ctx.body = { err: `The id:${id} doesn\'t match any game.` }
	} else {
		ctx.status = 200
		ctx.body = game
	}

	setCacheUrl(reqUrl, JSON.stringify(game))
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
