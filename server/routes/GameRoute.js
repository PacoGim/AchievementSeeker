const Router = require('koa-router')

const router = new Router({ prefix: '/games' })

const { getGame } = require('../models/GameModel')

router.get('/:id', async ctx => {
	ctx.body = await getGame(ctx['params']['id']).catch(err => console.log(err))
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
