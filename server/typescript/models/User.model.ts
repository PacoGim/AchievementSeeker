import fetch from 'node-fetch'
import bcrypt from 'bcryptjs'
import collections from '../db/collections'
// import { genID } from '../helpers/functions'

interface UserGames {}

class User {
	_id: string
	username: string
	password: string
	steamId: number
	dateJoined: Date
	games: UserGames[]
	constructor(_id: string, username: string, password: string, steamId: number, games: UserGames[]) {
		this._id = _id
		this.username = username
		this.password = bcrypt.hashSync(password, 10)
		this.steamId = steamId
		this.dateJoined = new Date()
		this.games = games
	}

	setGames(games: UserGames[]) {
		this.games = games
		return this
	}

	save() {
		return new Promise((resolve, reject) => {
			collections
				.getCollection('Users')
				.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
				.then(() => {
					resolve('Ok')
				})
				.catch(err => {
					reject(err)
				})
		})
	}
}

function getUserDataBySteamID(steamID: number) {
	return new Promise(async (resolve, reject) => {
		let userData = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamID}`).then(res => res.json())

		userData = userData['response']['players'][0]

		// communityvisibilitystate -> 1 = Private, 3 = Public
		delete userData['profilestate']
		delete userData['lastlogoff']
		delete userData['profileurl']
		delete userData['avatar']
		delete userData['avatarmedium']
		delete userData['personastate']
		delete userData['realname']
		delete userData['primaryclanid']
		delete userData['timecreated']
		delete userData['personastateflags']

		resolve(userData)
	})
}

export { User, getUserDataBySteamID }
