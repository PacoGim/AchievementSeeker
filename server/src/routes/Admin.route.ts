import Router from 'koa-router'

import koaBody from 'koa-body'
import { updateGame } from '../models/Game.model'

const router = new Router({ prefix: '/admin' })

router.options('*', (ctx) => {
	ctx['status'] = 200
})

router.patch('/:id', koaBody(), async (ctx) => {
	let { id } = ctx['params']
	let data = ctx['request']['body']

	if (id && data) {
		await updateGame(id, data)
	}

	ctx['body'] = 'WIP'
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
