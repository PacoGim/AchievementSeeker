import { Collection } from 'mongodb'
import { UserType } from '../../types/User.type'

let userCollection: Collection<UserType>

export default {
	get(): Collection<UserType>  {
		return userCollection
	},

	set(collection: Collection<any>) {
		userCollection = collection
	},
}
