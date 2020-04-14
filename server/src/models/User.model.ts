import UserCollection from '../database/collections/User.collection'

export interface IUser {
	steamId: string
}

export class User {
	private steamId: string
	private id:string

	constructor(data: IUser) {
		this.steamId = encryptId(data['steamId'])
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
}

export function findUserBySteamId(steamId: string): Promise<Object> {
	return new Promise((resolve, reject) => {
		UserCollection.get().findOne({ steamId: encryptId(steamId) }, (error, result) => {
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

function encryptId(id: string): string {
	return BigInt(id).toString(36)
}
