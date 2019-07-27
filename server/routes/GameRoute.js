const Router = require('koa-router')
const koaBody = require('koa-body')

const router = new Router({ prefix: '/games' })

const { getGame, getGames } = require('../models/GameModel')

router.post('/list', koaBody(), async ctx => {
	let games = await getGames(ctx['request']['body']).catch(err => {
		ctx.status = 400
		ctx.body = err
	})

	ctx.status = 200
	ctx.body = games
})

router.get('/:id', async ctx => {
	ctx.body = await getGame(ctx['params']['id']).catch(err => console.log(err))
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
