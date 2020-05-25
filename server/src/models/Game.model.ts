import GameCollection from '../database/collections/Game.collection'
import { GameType } from '../types/Game.type'
import { stringToNumber, stringToObjectId } from '../utils/functions'
import { ObjectId } from 'mongodb'

export function getGameById(id: string): Promise<GameType> {
	return new Promise(async (resolve) => {
		let games: GameType[] = await GameCollection.get()
			.find({ $or: [{ appid: stringToNumber(id) }, { _id: stringToObjectId(id) }] })
			.toArray()
		resolve(games[0])
	})
}

type CustomGameOptionTypeProject = {
	name?: 1
}

type CustomGameOptionType = {
	games?: string[]
	project?: CustomGameOptionTypeProject
	skip: number
	limit: number
}

export function getCustomGames(options: CustomGameOptionType): Promise<GameType[]> {
	return new Promise(async (resolve, reject) => {
		let { games, project, skip, limit } = options

		if (games === undefined) games = []

		if (project === undefined) project = {}

		let appidList: number[] = []
		let objectIdList: ObjectId[] = []

		games.forEach((game) => {
			if (isNaN(Number(game))) {
				// Is NOT a number type
				try {
					objectIdList.push(new ObjectId(game))
				} catch {}
			} else {
				appidList.push(Number(game))
			}
		})

		let gamesFound = await GameCollection.get()
			.find({
				$or: [{ appid: { $in: appidList } }, { _id: { $in: objectIdList } }]
			})
			.project(project)
			.skip(skip)
			.limit(limit)
			.toArray()
		resolve(gamesFound)
	})
}
