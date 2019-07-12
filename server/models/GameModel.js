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

module.exports = { Game, getGame }
