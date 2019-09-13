import Router from 'koa-router'
import koaBody from 'koa-body'
import send from 'koa-send'

const router = new Router({ prefix: '/games' })

import { getGame, getRandomGames, getCustomGames, getGameHeader, getGameRandomBg, getGameLogo, getGameList } from '../models/Game.model'

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

router.get('/header/:id', async ctx => {
	let { id } = ctx['params']

	await send(ctx, await getGameHeader(id), { root: '/' })
})

router.get('/background/:id/:isWebpSupported', async ctx => {
	let { id, isWebpSupported } = ctx['params']

	isWebpSupported = isWebpSupported === 'true' ? true : false

	if (isWebpSupported) {
		ctx.set('Content-Type', 'image/webp')
		await send(ctx, await getGameRandomBg(id, isWebpSupported), { root: '/' })
	} else {
		ctx.set('Content-Type', 'text/plain')
		ctx.body = await getGameRandomBg(id, isWebpSupported)
	}
})

router.get('/logo/:id/:isWebpSupported', async ctx => {
	let { id, isWebpSupported } = ctx['params']

	isWebpSupported = isWebpSupported === 'true' ? true : false

	let logoPath = await getGameLogo(id, isWebpSupported)

	if (logoPath !== '') {
		ctx.set('Content-Type', isWebpSupported ? 'image/webp' : 'image/png')
		ctx.status = 200
		await send(ctx, logoPath, { root: '/' })
	} else {
		ctx.set('Content-Type', 'application/json')
		ctx.status = 404
		ctx.body = {
			err: 'No logo available.',
		}
	}
})

router.get('/RandomGames/:quantity', async ctx => {
	const { quantity } = ctx['params']

	ctx['body'] = await getRandomGames(quantity)
})

router.get('/:id/:options', async ctx => {
	const reqUrl = ctx['req']['url'] || ''

	let { id, options } = ctx['params']
	options = options.split(',')

	let project: { [index: string]: number } = {}

	for (let option of options) {
		project[option] = 1
	}

	const game = await getCustomGames({
		filter: {
			_id: id,
		},
		project,
	})

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
