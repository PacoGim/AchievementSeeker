import { UserType } from '../types/User.type'
import UserCollection from '../database/collections/User.collection'

export function findUserBySteamId(steamId: string): Promise<UserType | null> {
	return new Promise((resolve, reject) => {
		UserCollection.get().findOne({ steamId }, (error, result) => {
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

export function saveUser(user: UserType): Promise<UserType> {
	return new Promise((resolve, reject) => {
		UserCollection.get().insertOne(user, (error) => {
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
