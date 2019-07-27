const db = require('../db').collections
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

async function getGames(options) {
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

		await db.Games.find(filter)
			.project(project)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.toArray((err, docs) => {
				resolve(docs)
			})
	})
}

module.exports = { Game, getGame, getGames }
