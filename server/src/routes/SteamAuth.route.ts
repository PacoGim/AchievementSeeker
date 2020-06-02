import Router from 'koa-router'
import passport from 'koa-passport'

import { findUserBySteamId, saveUser } from '../models/User.model'

import { getToken } from '../utils/jwt'
import { fetchUserGames } from '../utils/fetch'
import { UserType } from '../types/User.type'

const router = new Router({ prefix: '/steam' })

router.get('/login', passport.authenticate('steam', { failureRedirect: '/' }))

router.get('/return', async (ctx) => {
	// Extracts the user steam id from the request
	const steamId = ctx['query']['openid.identity'].replace('https://steamcommunity.com/openid/id/', '')
	let redirectUrl = ''
	let jwtPayload = {}

	// Looks if user exists in DB to create it if not
	await findUserBySteamId(steamId).then(async (result) => {
		if (result === null) {
			// If User doesn't exist, we create it
			const user: UserType = {
				steamId
			}

			// And save it
			await saveUser(user).then(async (response) => {
				if (response?.['_id']) {
					jwtPayload = { id: response['_id'] }

					fetchUserGames(response['_id'], steamId)
				}
			})
		} else {
			// If User exists
			jwtPayload = { id: result['_id'] }
		}
	})

	const token = await getToken(jwtPayload)

	if (token) {
		ctx.cookies.set('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
	}

	ctx.redirect('http://192.168.1.199:8080/user/redirect')
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
