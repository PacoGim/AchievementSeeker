import { Resolver, FieldResolver, Root, Query } from 'type-graphql'
import gameCollection from '../database/collections/GameCollection'
import { GraphQLDeveloper } from '../schemas/DeveloperSchema'
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
