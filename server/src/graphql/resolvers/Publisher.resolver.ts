import { Resolver, FieldResolver, Root, Query } from 'type-graphql'
import GameCollection from '../../database/collections/Game.collection'
import { GraphQLPublisher } from '../schemas/Publisher.schema'
import { IPublisher } from '../../models/Publisher.model'

@Resolver(of => GraphQLPublisher)
export default class {
	@FieldResolver()
	async games(@Root() publisher: IPublisher) {
		let result = await GameCollection.get()
			.find({ publishers: { $in: [publisher['name']] } })
			.toArray()
		return result
	}
}
