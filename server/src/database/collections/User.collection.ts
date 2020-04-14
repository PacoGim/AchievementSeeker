import { Collection } from 'mongodb'
import { User } from '../../models/User.model'

let userCollection: Collection<User>

export default {
	get(): Collection<User>  {
		return userCollection
	},

	set(collection: Collection<any>) {
		userCollection = collection
	},
}
