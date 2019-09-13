import collections from '../db/collections'

import axios from 'axios'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs-extra'

import { genNum, hashCode } from '../helpers/functions'

class Game {
	name: string
	points: number
	_id: string
	appid: number
	backgrounds: string[]
	constructor(_id: string, name: string, points: number, appid: number, backgrounds: string[]) {
		this._id = _id
		this.appid = appid
		this.name = name
		this.points = points
		this.backgrounds = backgrounds
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
	filter: Object
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

async function getGameHeader(_id: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		let games = await getCustomGames({ filter: { _id }, project: { appid: 1, _id: 1, name: 1 } })

		let game = games[0]

		let imagePath: string = await getImage(`https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/header.jpg`, `/images/${escapeString(game['name'])}-${game['_id']}`, `header.webp`)

		resolve(imagePath)
	})
}

async function getGameRandomBg(_id: string, isWebpSupported: boolean):Promise<string> {
	return new Promise(async (resolve, reject) => {
		let games = await getCustomGames({ filter: { _id }, project: { appid: 1, backgrounds: 1, _id: 1, name: 1 } })

		let game = games[0]

		let background = game['backgrounds'][genNum(0, game['backgrounds'].length - 1)]

		if (!isWebpSupported) {
			return resolve(`https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/${background}`)
		}

		let hashedName = hashCode(background)

		let imagePath:string = await getImage(`https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/${background}`, `/images/${escapeString(game['name'])}-${game['_id']}/backgrounds`, `${hashedName}.webp`)

		resolve(imagePath)
	})
}

function getGameLogo(_id: string, isWebpSupported: boolean):Promise<string> {
	return new Promise(async (resolve, reject) => {
		let games = await getCustomGames({ filter: { _id }, project: { name: 1 } })
		let game = games[0]

		let filePath = path.join(path.resolve(), `server/images/${escapeString(game['name'])}-${game['_id']}/Logos/logo.${isWebpSupported ? 'webp' : 'png'}`)

		if (fs.existsSync(filePath)) {
			resolve(filePath)
		} else {
			resolve('')
		}
	})
}

function getImage(fileUrl: string, filePath: string, fileName: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			filePath = path.join(path.resolve(), 'server', filePath, '/')

			let fullPath = path.join(filePath, fileName)

			if (fs.existsSync(fullPath)) {
				resolve(fullPath)
			} else {
				await fs.mkdirp(filePath)
				axios.get(fileUrl, { responseType: 'arraybuffer' }).then(res => {
					sharp(Buffer.from(res['data']))
						.webp({ quality: 80 })
						.toFile(fullPath, (err, output) => {
							if (!err) {
								resolve(fullPath)
							}
						})
				})
			}
		} catch (ex) {
			console.log(ex)
		}
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

export { Game, getRandomGames, getGame, getCustomGames, getGameHeader, getGameRandomBg, getGameLogo, getGameList }
