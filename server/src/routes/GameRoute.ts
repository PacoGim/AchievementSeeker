// import Router from 'koa-router'
// import koaBody from 'koa-body'
// import { ParameterizedContext } from 'koa'

// const router = new Router({ prefix: '/games' })

// import { getGame, getCustomGames, getCustomGame, getGameList } from '../models/GameModel'

// import { setCacheUrl } from '../url-cache'

// router.get('/list', async (ctx: ParameterizedContext) => {
// 	let games

// 	const reqUrl = ctx['req']['url'] || ''

// 	games = await getGameList()

// 	setCacheUrl(reqUrl, JSON.stringify(games))

// 	ctx.body = games
// })

// router.post('/customGames', koaBody(), async (ctx: ParameterizedContext) => {
// 	let options = ctx['request']['body']

// 	try {
// 		options = JSON.parse(options)
// 	} catch {}

// 	let games = await getCustomGames(options).catch((err: Error) => {
// 		ctx.status = 400
// 		ctx.body = err
// 	})

// 	ctx.status = 200
// 	ctx.body = games
// })

// router.get('/:id/:options', async (ctx: ParameterizedContext) => {
// 	const reqUrl = ctx['req']['url'] || ''

// 	let { id, options } = ctx['params']
// 	options = options.split(',')

// 	let project: { [index: string]: number } = {}

// 	for (let option of options) {
// 		project[option] = 1
// 	}

// 	const game = await getCustomGame({
// 		filter: {
// 			_id: id,
// 		},
// 		project,
// 	})

// 	if (!game) {
// 		ctx.status = 404
// 		ctx.body = { err: `The id:${id} doesn\'t match any game.` }
// 	} else {
// 		ctx.status = 200
// 		ctx.body = game
// 	}

// 	setCacheUrl(reqUrl, JSON.stringify(game))
// })

// router.get('/:id', async (ctx: ParameterizedContext) => {
// 	const reqUrl = ctx['req']['url'] || ''

// 	const id = ctx['params']['id']
// 	const game = await getGame(id).catch(err => console.log(err))

// 	if (!game) {
// 		ctx.status = 404
// 		ctx.body = { err: `The id:${id} doesn\'t match any game.` }
// 	} else {
// 		ctx.status = 200
// 		ctx.body = game
// 	}

// 	setCacheUrl(reqUrl, JSON.stringify(game))
// })

// module.exports = {
// 	routes: router.routes(),
// 	allowedMethods: router.allowedMethods(),
// }
