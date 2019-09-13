import Router from 'koa-router'

const router = new Router({ prefix: '/user' })

import { getUserDataBySteamID } from '../models/User.model'

router.get('/GetUserDataBySteamID/:id', async ctx => {
	const { id } = ctx['params']

	const userData = await getUserDataBySteamID(id)

	ctx['body'] = userData
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
