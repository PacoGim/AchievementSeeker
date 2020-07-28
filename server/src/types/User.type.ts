import { ObjectId } from 'mongodb'
import { UserGameAchievementType } from './Game.type'

import { saveUser } from '../models/User.model'
import { debugWrite } from '../debug'

export class User implements UserType {
	_id: ObjectId
	steamId: string

	constructor() {}

	getId(): ObjectId {
		return this._id
	}

	setSteamId(steamId: string): User {
		this.steamId = steamId
		return this
	}

	getSteamId() {
		return this.steamId
	}

	save(): Promise<User> {
		return new Promise((resolve, reject) => {
			saveUser(this)
				.then(() => resolve(this))
				.catch((err) => {
					debugWrite('error', err)
					reject(null)
				})
		})
	}
}

export type UserType = {
	_id?: ObjectId
	steamId?: string
	games?: UserGamesType[]
	game?: UserGameAchievementType
}

type UserGamesType = {
	_id: ObjectId
	achievements: number[]
}

export type UserGameQueueType = {
	appId: number
	gameId: ObjectId
	userId: ObjectId
	steamId: string
}

export type UserGameType = {}

export type UserModulesType = {
	id: string
	games: (string | number)[]
}
