import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class GraphQLDifficulty {
	@Field(type => Int)
	easy: number

	@Field(type => Int)
	medium: number

	@Field(type => Int)
	hard: number

	@Field(type => Int)
	average: number
}
