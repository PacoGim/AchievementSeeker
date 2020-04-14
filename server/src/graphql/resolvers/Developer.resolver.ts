import { Resolver, FieldResolver, Root, Query } from 'type-graphql'
import gameCollection from '../../database/collections/Game.collection'
import { GraphQLDeveloper } from '../schemas/Developer.schema'
import { IDeveloper } from '../../models/Developer.model'

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
