import { Resolver, FieldResolver, Root, Query } from 'type-graphql'
import gameCollection from '../db/collections/GameCollection'
import { GraphQLDeveloper } from '../entities/schemas/DeveloperSchema'
import { IDeveloper } from '../entities/DeveloperEntity'

@Resolver(of => GraphQLDeveloper)
export default class {
	@FieldResolver()
	async games(@Root() developer: IDeveloper) {
		let result = await gameCollection
			.get()
			.find({ developers: { $in: [developer['name']] } })
			.toArray()
		return result
	}
}
