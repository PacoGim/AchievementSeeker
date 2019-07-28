const Router = require('koa-router')
const koaBody = require('koa-body')

const router = new Router({ prefix: '/games' })

const { getGame, getGames } = require('../models/GameModel')

router.post('/list', koaBody(), async ctx => {
	let games = await getGames(JSON.parse(ctx['request']['body'])).catch(err => {
		ctx.status = 400
		ctx.body = err
	})

	ctx.status = 200
	ctx.body = games
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
