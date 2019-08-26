const Router = require('koa-router')
const passport = require('koa-passport')

const fetch = require('node-fetch')

const router = new Router({ prefix: '/steam' })

router.get(
	'/login',
	passport.authenticate('steam', {
		failureRedirect: '/',
	})
)

router.get('/return', async ctx => {
	const userSteamId = ctx['query']['openid.identity'].replace('https://steamcommunity.com/openid/id/', '')

	console.log(userSteamId)

	ctx.redirect(
		`http://localhost:3000/user/register/${Buffer.from(userSteamId)
			.toString('base64')
			.replace('=', '')}`
	)
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
