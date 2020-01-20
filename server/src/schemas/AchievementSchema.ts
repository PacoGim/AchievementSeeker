import { ObjectType, Field, Float } from 'type-graphql'

@ObjectType()
export class GraphQLAchievement {
	@Field()
	_id!: number

	@Field()
	name!: string

	@Field()
	steamName!: string

	@Field({ nullable: true })
	description!: string

	@Field({ nullable: true })
	img!: string

	@Field({ nullable: true })
	imgGray!: string

	@Field(type => Float)
	value!: number

	@Field(type => Float)
	score!: number

	@Field({ nullable: true })
	isHidden!: boolean
}