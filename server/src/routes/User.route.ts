import Router from 'koa-router'
import { getUserGameData } from '../models/User.model'
import { getTokenData, verifyToken } from '../utils/jwt'
// import { UserType } from '../types/User.type'
import { CodeType } from '../types/Code.type'
import { User } from '../types/User.type'
import { UserCollection } from '../database/collections/User.collection'
import { ObjectID } from 'mongodb'

const router = new Router({ prefix: '/user' })

router.get('/logout', (ctx) => {
	ctx.cookies.set('jwt')

	ctx['body'] = {
		code: CodeType['UserLogOut'],
		error: false
	}

	ctx.set('Access-Control-Allow-Credentials', 'true')
})

router.get('/isLoggedIn', async (ctx) => {
	const token = ctx.cookies.get('jwt')

	if (token) {
		let isTokenValid = await verifyToken(token).catch(() => {
			ctx['body'] = { code: CodeType['InvalidJWT'], error: true, message: 'Token Invalid' }
		})

		if (isTokenValid) {
			ctx['body'] = { code: CodeType['ValidToken'], error: false, message: 'Token Valid' }
		}
	} else {
		ctx['body'] = { code: CodeType['UserNotLoggedIn'], error: true, message: 'User not logged in' }
	}

	ctx.set('Access-Control-Allow-Credentials', 'true')
})

router.get('/:gameId', async (ctx) => {
	const token = ctx.cookies.get('jwt')
	const gameId = ctx['params']['gameId']

	ctx.set('Access-Control-Allow-Credentials', 'true')

	if (token) {
		let data: any = await getTokenData(token).catch((err) => {
			ctx['status'] = 200
			return (ctx['body'] = { error: true, message: 'No Valid Token Provided' })
		})

		if (data) {
			let userGame = await getUserGameData(data['id'], gameId).catch((error) => {
				console.log(error)
			})

			if (userGame) {
				ctx['status'] = 200
				ctx['body'] = userGame
			} else {
				ctx['status'] = 200
				ctx['body'] = {
					code: CodeType.NoUserGameFound,
					error: true,
					message: "The user doesn't have this game."
				}
			}
		}
	} else {
		return (ctx['body'] = { error: true, message: 'No Token Provided' })
	}
})

router.get('/games/:userId', async (ctx) => {
	let id = ctx['params']['userId']

	let counter = 0

	let user = await UserCollection.findOne({ _id: new ObjectID(id) })

	if (user?.['games']) {
		user['games'].forEach((game) => {
			if (game['achievements'].length>0) {
				// console.log(game['achievements'].length)
				counter++
			}
		})

		console.log(counter)
	}

	ctx['body'] = 'OK'
})
// router.post('/', koaBody(), async (ctx) => {
// 	let options = ctx['request']['body']

// 	if (typeof options !== 'object') {
// 		ctx['status'] = 200
// 		return (ctx['body'] = 'Submit a valid JSON type POST request.')
// 	}

// 	let user = await getModularUser(options)
// 	ctx['body'] = user
// })

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods()
}
