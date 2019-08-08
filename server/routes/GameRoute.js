const Router = require('koa-router')
const koaBody = require('koa-body')
const send = require('koa-send')

const router = new Router({ prefix: '/games' })

const { getGame, getCustomGames, getGameHeader, getGameRandomBg, getGameLogo } = require('../models/GameModel')

router.post('/customGames', koaBody(), async ctx => {
	let options = ctx['request']['body']
	try {
		options = JSON.parse(options)
	} catch {}

	let games = await getCustomGames(options).catch(err => {
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

	if (logoPath) {
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

router.get('/:id', async ctx => {
	const id = ctx['params']['id']
	const game = await getGame(id).catch(err => console.log(err))

	if (!game) {
		ctx.status = 404
		ctx.body = { err: `The id:${id} doesn\'t match any game.` }
	} else {
		ctx.status = 200
		ctx.body = game
	}
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
