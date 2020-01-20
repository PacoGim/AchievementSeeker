import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class GraphQLReleaseDateSplit {
	@Field(type => Int)
	year: number

	@Field(type => Int)
	month: number
}
