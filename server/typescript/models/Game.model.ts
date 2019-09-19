import collections from '../db/collections'

import { genNum, hashCode } from '../helpers/functions'

interface Achievement {
	_id: number
	img: string
	imgGray:string
}

class Game {
	name: string
	points: number
	_id: string
	appid: number
	backgrounds: string[]
	achievements: Achievement[]
	constructor(_id: string, name: string, points: number, appid: number, backgrounds: string[], achievements: Achievement[]) {
		this._id = _id
		this.appid = appid
		this.name = name
		this.points = points
		this.backgrounds = backgrounds
		this.achievements = achievements
	}

	save() {
		console.log(this)
	}
}

function getRandomGames(quantity: number) {
	return new Promise(async (resolve, reject) => {
		let gameList: Game[] = await getGameList()
		let sumScore = 0

		for (let i = 0; i < quantity; i++) {
			let randomNumber = genNum(0, gameList.length)

			let games: Game[] = await getCustomGames({ filter: { _id: gameList[randomNumber]['_id'] }, project: { points: 1, _id: 0 } })
			let game = games[0]

			sumScore += game['points']
		}

		resolve(sumScore.toFixed(2))
	})
}

function getGame(_id: string) {
	return new Promise(resolve => resolve(collections.getCollection('Games').findOne({ _id })))
}

interface Options {
	filter?: Object
	project: Object
	sort?: Object
	limit?: number
	skip?: number
}

async function getCustomGames(options: Options): Promise<Game[]> {
	return new Promise(async (resolve, reject) => {
		if (!options) {
			options = { filter: {}, project: { _id: 0, name: 1 }, sort: { releaseDate: -1 }, limit: 10, skip: 0 }
		}

		let { filter, project, sort = { releaseDate: -1 }, limit = 10, skip = 0 } = options

		if (limit > 20) {
			return reject({
				err: 'Max limit allowed is 20. Sorry for the inconvenience.',
			})
		}

		await collections
			.getCollection('Games')
			.find(filter)
			.project(project)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.toArray((err, docs) => {
				resolve(docs)
			})
	})
}

async function getCustomGame(options: Options): Promise<Game> {
	return new Promise(async (resolve, reject) => {
		let games = await getCustomGames(options)
		resolve(games[0])
	})
}

function getGameList(): Promise<Game[]> {
	return new Promise((resolve, reject) => {
		collections
			.getCollection('Games')
			.find({})
			.project({ name: 1, _id: 1 })
			.toArray((err, docs) => {
				resolve(docs)
			})
	})
}

function escapeString(charChain: string) {
	return charChain.replace(/[^a-z0-9]/gi, '').substring(0, 20)
}

export { Game, getRandomGames, getGame, getCustomGames, getCustomGame, getGameList }
