import Router from 'koa-router'

import GameCollection from '../db/collections/GameCollection'

import { setCacheUrl } from '../url-cache'
import { IGame } from '../entities/GameEntity'

const router = new Router({ prefix: '/games' })

router.get('/search/:query', async ctx => {
	let limit: number | undefined = ctx['query']['limit']

	let query: string = ctx['params']['query']

	if (query) {
		let foundGamesArray: IGame[] = []

		let regAlias: RegExp = RegExp(`${query}`)
		let regName: RegExp = RegExp(`${query}`, 'i')

		let gamesSearchName: IGame[] = await GameCollection.get()
			.find({ name: { $regex: regName } })
			.project({ name: 1, _id: 1, appid: 1, alias: 1 })
			.toArray()

		let gamesSearchAlias: IGame[] = await GameCollection.get()
			.find({ alias: { $in: [regAlias] } })
			.project({ name: 1, _id: 1, appid: 1, alias: 1 })
			.toArray()

		gamesSearchName = gamesSearchName.filter(a => !gamesSearchAlias.find(b => a['_id'] === b['_id']))

		foundGamesArray = gamesSearchAlias.concat(gamesSearchName)

		if (limit !== undefined) {
			foundGamesArray = foundGamesArray.slice(0, limit)
		}

		if (foundGamesArray.length > 0) {
			ctx.status = 200
			ctx.body = foundGamesArray
		} else {
			ctx.status = 204
			ctx.set('Response-Detail', `No game found.`)
		}
	}
})

// router.get('/update', async ctx => {

//   let games = await GameCollection.get().find({}).toArray()

//   games.forEach(game => {
//     let alias = aliasFromName(game['name'])

//     if (alias[0].length > 1) {
//       game['alias'] = aliasFromName(game['name'])
//     } else {
//       game['alias'] = []
//     }

//     GameCollection.get().updateOne({ _id: game['_id'] }, { $set: game }, { upsert: true }, (error, result) => {
//       if (error) {
//         console.log(error)
//       } else {

//         console.log(result['modifiedCount'])
//       }
//     })
//   });

//   ctx.body = 'Ok'
// })

function aliasFromName(name: string): string[] {
	let alias: string = name

	alias = alias.replace(':', ' ')
	alias = alias.replace('-', ' ')
	alias = alias.replace('/', ' ')
	alias = alias.replace(')', ' ')
	alias = alias.replace('(', ' ')

	alias = alias
		.split(' ')
		.map(x => {
			if (RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$').test(x)) {
				return x
			} else {
				return x.substring(0, 1)
			}
		})
		.join('')
		.toLowerCase()

	return [alias]
}

router.get('/genres', async ctx => {
	const genres = await GameCollection.get().distinct('genres')
	if (genres !== undefined && genres.length > 0) {
		ctx['status'] = 200
		ctx['body'] = genres
		setCacheUrl(ctx)
	} else {
		ctx['status'] = 204
	}
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
