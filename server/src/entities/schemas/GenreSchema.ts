import { Field, ObjectType } from 'type-graphql'
import { GraphQLGame } from './GameSchema'

@ObjectType()
export class GraphQLGenre {
	@Field(type => String)
	type!: string

	@Field(type => [GraphQLGame])
	games!: GraphQLGame[]
}
