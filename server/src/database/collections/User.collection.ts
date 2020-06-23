import { Collection } from 'mongodb'
import { UserType } from '../../types/User.type'

export let UserCollection: Collection<UserType>

export function set(collection: Collection<any>) {
	UserCollection = collection
}
