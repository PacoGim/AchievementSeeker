import { Field, ObjectType } from 'type-graphql'
import { GraphQLGame } from './GameSchema'

@ObjectType()
export class GraphQLDeveloper {
	@Field(type => String)
	name!: string

	@Field(type => [GraphQLGame])
	games!: GraphQLGame[]
}
