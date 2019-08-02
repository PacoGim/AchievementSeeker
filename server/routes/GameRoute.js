const Router = require('koa-router')
const koaBody = require('koa-body')

const router = new Router({ prefix: '/games' })

const { getGame, getCustomGames, getGameHeader, getGameRandomBg } = require('../models/GameModel')

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
	let id = ctx['params']['id']

	ctx.body = await getGameHeader(id)
})

router.get('/background/:id', async ctx => {
	let id = ctx['params']['id']

	ctx.body = await getGameRandomBg(id)
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
