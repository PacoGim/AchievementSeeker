const db = require('../db').collections

const { get } = require('axios')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs-extra')
const { encode } = require('base64-arraybuffer')

const { genNum, hashCode } = require('../helpers/functions')

class Game {
	constructor(name, steamID) {
		this.name = name
		this.steamID = steamID
	}

	save() {
		console.log(this)
	}
}

async function getGame(_id) {
	return new Promise(async resolve => resolve(await db.Games.findOne({ _id })))
}

async function getCustomGames(options) {
	return new Promise(async (resolve, reject) => {
		if (!options) {
			options = { filter: {}, project: { _id: 0, name: 1 }, sort: { releaseDate: -1 }, limit: 10, skip: 0 }
		}

		let { filter, project, sort = { releaseDate: -1 }, limit = 10, skip = 0, isOne = false } = options

		if (limit > 20) {
			return reject({
				err: 'Max limit allowed is 20. Sorry for the inconvenience.',
			})
		}

		await db.Games.find(filter)
			.project(project)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.toArray((err, docs) => {
				if (options['isOne'] === true) {
					resolve(docs[0])
				} else {
					resolve(docs)
				}
			})
	})
}

async function getGameHeader(_id) {
	return new Promise(async (resolve, reject) => {
		let game = await getCustomGames({ filter: { _id }, project: { appid: 1, _id: 1, name: 1 }, isOne: true })

		let imageBuffer = await getImage(`https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/header.jpg`, `/images/${escapeString(game['name'])}-${game['_id']}`, `header.webp`)

		resolve(imageBuffer)
	})
}

async function getGameRandomBg(_id) {
	return new Promise(async (resolve, reject) => {
		let game = await getCustomGames({ filter: { _id }, project: { appid: 1, backgrounds: 1, _id: 1, name: 1 }, isOne: true }, true)

		let background = game['backgrounds'][genNum(0, game['backgrounds'].length - 1)]
		let hashedName = hashCode(background)

		let imageBuffer = await getImage(`https://steamcdn-a.akamaihd.net/steam/apps/${game['appid']}/${background}`, `/images/${escapeString(game['name'])}-${game['_id']}/backgrounds`, `${hashedName}.webp`)

		resolve(imageBuffer)
	})
}

function getImage(fileUrl, filePath, fileName) {
	return new Promise(async (resolve, reject) => {
		try {
			filePath = path.join(path.resolve(), 'server', filePath, '/')

			let fullPath = path.join(filePath, fileName)

			if (fs.existsSync(fullPath)) {
				resolve(`data:image/webp;base64,${encode(fs.readFileSync(fullPath))}`)
			} else {
				await fs.mkdirp(filePath)
				get(fileUrl, { responseType: 'arraybuffer' }).then(res => {
					sharp(new Buffer.from(res['data']))
						.webp({ quality: 80 })
						.toBuffer((err, buffer) => {
							resolve(`data:image/webp;base64,${encode(buffer)}`)
						})
						.toFile(fullPath)
				})
			}
		} catch (ex) {
			console.log(ex)
		}
	})
}

function escapeString(string) {
	return string.replace(/[^a-z0-9]/gi, '').substring(0, 20)
}

module.exports = { Game, getGame, getCustomGames, getGameHeader, getGameRandomBg }
