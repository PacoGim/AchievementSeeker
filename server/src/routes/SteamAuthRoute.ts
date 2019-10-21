import { ParameterizedContext } from 'koa'
import Router from 'koa-router'
import passport from 'koa-passport'

const router = new Router({ prefix: '/steam' })

router.get(
	'/login',
	passport.authenticate('steam', {
		failureRedirect: '/',
	})
)

router.get('/return', async (ctx:ParameterizedContext) => {
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
