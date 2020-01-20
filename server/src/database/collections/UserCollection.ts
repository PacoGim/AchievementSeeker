import { Collection } from 'mongodb'
import { IUser } from '../../entities/UserEntity'

let userCollection: Collection<IUser>

export default {
	get(): Collection<IUser>  {
		return userCollection
	},

	set(collection: Collection<any>) {
		userCollection = collection
	},
}
