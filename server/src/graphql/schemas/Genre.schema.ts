import { Field, ObjectType } from 'type-graphql'
import { GraphQLGame } from './Game.schema'

@ObjectType()
export class GraphQLGenre {
	@Field(type => String)
	type!: string

	@Field(type => [GraphQLGame])
	games!: GraphQLGame[]
}
