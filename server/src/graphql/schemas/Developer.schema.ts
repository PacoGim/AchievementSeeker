import { Field, ObjectType } from 'type-graphql'
import { GraphQLGame } from './Game.schema'

@ObjectType()
export class GraphQLDeveloper {
	@Field(type => String)
	name!: string

	@Field(type => [GraphQLGame])
	games!: GraphQLGame[]
}
