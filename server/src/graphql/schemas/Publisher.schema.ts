import { Field, ObjectType } from 'type-graphql'
import { GraphQLGame } from './Game.schema'

@ObjectType()
export class GraphQLPublisher {
	@Field(type => String)
	name!: string

	@Field(type => [GraphQLGame])
	games!: GraphQLGame[]
}
