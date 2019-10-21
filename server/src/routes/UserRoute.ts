/*
import { ParameterizedContext } from 'koa'
import Router from 'koa-router'

const router = new Router({ prefix: '/user' })

import { getUserDataBySteamID } from '../models/UserModel'

router.get('/GetUserDataBySteamID/:id', async (ctx:ParameterizedContext) => {
	const { id } = ctx['params']

	const userData = await getUserDataBySteamID(id)

	ctx['body'] = userData
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
*/