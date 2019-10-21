import { Resolver, FieldResolver, Root, Query } from 'type-graphql'
import GameCollection from '../db/collections/GameCollection'
import { GraphQLPublisher } from '../entities/schemas/PublisherSchema'
import { IPublisher } from '../entities/PublisherEntity'

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
