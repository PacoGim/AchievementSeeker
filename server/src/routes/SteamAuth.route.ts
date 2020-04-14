import Router from 'koa-router'
import passport from 'koa-passport'

import { User, findUserBySteamId } from '../models/User.model'

import { getToken } from '../utils/jwt'

const router = new Router({ prefix: '/steam' })

router.get('/login', passport.authenticate('steam', { failureRedirect: '/' }))

router.get('/return', async (ctx) => {
	const userSteamId = ctx['query']['openid.identity'].replace('https://steamcommunity.com/openid/id/', '')

	await findUserBySteamId(userSteamId).then(async (result) => {
		if (result === null) {
			// User doesn't exist so we create it
			const user = new User({ steamId: userSteamId })

			await user.save().then(async (response) => {
				let token = await getToken({ id: response['id'] })

				if (token) {
					ctx.cookies.set('jwt', token, { httpOnly: true, sameSite: 'strict' })
				}

				ctx.redirect(`http://192.168.1.199:8080/user/welcome`)
			})
		} else {
			// User exists
			ctx.redirect(`http://192.168.1.199:8080`)
		}
	})
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
