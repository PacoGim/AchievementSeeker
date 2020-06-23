import { UserType } from '../types/User.type'
import {UserCollection} from '../database/collections/User.collection'
import { ObjectId } from 'mongodb'

export function findUserBySteamId(steamId: string): Promise<UserType | null> {
	return new Promise((resolve, reject) => {
		UserCollection.findOne({ steamId }, (error, result) => {
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

export function getUserGameData(userId: string, gameId: string): Promise<UserType | null> {
	return new Promise((resolve, reject) => {
		UserCollection.findOne(
			{ _id: new ObjectId(userId) },
			{
				projection: {
					games: {
						$elemMatch: {
							_id: new ObjectId(gameId)
						}
					}
				}
			},
			(error, result) => {
				if (error) {
					reject(error)
				} else {
					if (result && result['games']) {
						result['game'] = result['games'][0]
						delete result['games']

						resolve(result)
					} else {
						resolve(null)
					}
				}
			}
		)
	})
}

export function saveUser(user: UserType): Promise<UserType> {
	return new Promise((resolve, reject) => {
		UserCollection.insertOne(user, (error) => {
			if (error) {
				reject({
					errCode: error['code'],
					message: error['errmsg']
				})
			} else {
				resolve(user)
			}
		})
	})
}
