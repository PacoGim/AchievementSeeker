import Router from 'koa-router'
import passport from 'koa-passport'

import { findUserBySteamId } from '../models/User.model'

import { getToken } from '../utils/jwt'
import { fetchUserGames } from '../utils/fetch'
import { User } from '../types/User.type'

import { debugWrite } from '../debug'

const router = new Router({ prefix: '/steam' })

router.get('/login', passport.authenticate('steam', { failureRedirect: '/' }))

router.get('/return', async (ctx) => {
	// Extracts the user steam id from the request
	const steamId = ctx['query']['openid.identity'].replace('https://steamcommunity.com/openid/id/', '')

	let jwtPayload = {}

	// Looks if user exists in DB to create it if not
	let userFound = await findUserBySteamId(steamId).catch((err) => debugWrite('error', err))

	if (userFound) {
		// Sets the user id as jwt token for client requests
		jwtPayload = { id: userFound['_id'] }
	} else {
		// User doesn't exist so it creates it
		const user: User = new User()

		// Sets the steam id and saves the user to the db
		let result = await user.setSteamId(steamId).save()

		// Sets JWT Payload to the user id
		jwtPayload = { id: result.getId() }

		// Starts the games fetching function
		fetchUserGames(result.getId(), result.getSteamId())
	}

	// Creates a JWT token
	const token = await getToken(jwtPayload)

	// If the token was correctly created (usually should be fine)
	if (token) ctx.cookies.set('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

	ctx.redirect('http://192.168.1.199:8080/user/redirect')
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
