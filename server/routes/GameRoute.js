const Router = require('koa-router')

const router = new Router({ prefix: '/games' })

router.get('/', ctx => {
	ctx.body = 'Hi from games'
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
