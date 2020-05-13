import UserCollection from '../database/collections/User.collection'
import { ObjectID } from 'mongodb'
import { IAchievement } from './Achievement.model'

import { encrypt } from '../utils/crypt'

export interface IUserGameQueue {
	appId: number
	gameId: string
	userId: ObjectID
	steamId: string
}

interface IUserGames {
	_id: string
	achievements: number[]
}

export interface IUser {
	_id?: ObjectID
	steamId: string
	games?: IUserGames[]
}

export class User {
	_id: ObjectID
	steamId: string
	games: IUserGames[]

	constructor(data: IUser) {
		this.steamId = encrypt(data['steamId'])
		this.games = []
	}

	save(): Promise<User> {
		return new Promise((resolve, reject) => {
			UserCollection.get().insertOne(this, (error) => {
				if (error) {
					reject({
						errCode: error['code'],
						message: error['errmsg']
					})
				} else {
					resolve(this)
				}
			})
		})
	}

	delete() {
		UserCollection.get().deleteOne({ _id: this._id })
	}
}

export function findUserBySteamId(steamId: string): Promise<User | null> {
	return new Promise((resolve, reject) => {
		console.log(encrypt(steamId))
		UserCollection.get().findOne({ steamId: encrypt(steamId) }, (error, result) => {
			if (error) {
				reject({
					errCode: error['code'],
					message: error['errmsg']
				})
			} else {
				resolve(result)
			}
		})
	})
}
