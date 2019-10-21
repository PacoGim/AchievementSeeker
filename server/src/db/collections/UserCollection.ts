import { Collection } from 'mongodb'
import { IUser } from '../../entities/UserEntity'

let userCollection: Collection<IUser>

export default {
	get() {
		return userCollection
	},

	set(collection: Collection<IUser>) {
		userCollection = collection
	},
}
