import Router from 'koa-router'
import passport from 'koa-passport'

import { User, findUserBySteamId } from '../models/User.model'

import { getToken } from '../utils/jwt'
import { fetchUserGames } from '../utils/fetch'
import UserCollection from '../database/collections/User.collection'

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
			const user = new User({ steamId })

			// And save it
			await user.save().then(async (response) => {
				jwtPayload = { id: response['_id'] }
				redirectUrl = 'http://192.168.1.199:8080/user/welcome'

				fetchUserGames(response['_id'], steamId)

				// setTimeout(() => {
				// 	user.delete()
				// }, 2000)

				/*TODO Fetch user games list
					TODO Add the user to the fetch list
				*/
			})
		} else {
			fetchUserGames(result['_id'], steamId)

			// If User exists
			// jwtPayload = { id: result['_id'] }
			// redirectUrl = 'http://192.168.1.199:8080'
		}
	})

	const token = await getToken(jwtPayload)

	if (token) {
		ctx.cookies.set('jwt', token, { httpOnly: true, sameSite: 'strict' })
	}

	ctx.redirect(redirectUrl)
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
