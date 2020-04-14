import { ObjectType, Field, Int, Float } from 'type-graphql'
import { GraphQLDifficulty } from './Difficulty.schema'
import { GraphQLAchievement } from './Achievement.schema'
import { GraphQLDeveloper } from './Developer.schema'
import { GraphQLPublisher } from './Publisher.schema'
import { GraphQLGenre } from './Genre.schema'
import { GraphQLReleaseDateSplit } from './ReleaseDateSplit.schema'

@ObjectType()
export class GraphQLGame {
	@Field() _id!: string
	@Field(type => Int) achievementCount!: number
	@Field(type => [GraphQLAchievement]) achievements: GraphQLAchievement[]
	@Field(type => Int) age: number
	@Field(type => [String]) alias: string[]
	@Field(type => Int) appid: number
	@Field(type => [String]) backgrounds: string[]
	@Field() createdAt: Date
	@Field(type => [GraphQLDeveloper]) developers: GraphQLDeveloper[]
	@Field() difficulty: GraphQLDifficulty
	@Field(type => [GraphQLGenre]) genres: GraphQLGenre[]
	@Field() isFree: boolean
	@Field() name: string
	@Field(type => [String]) platforms: string[]
	@Field(type => Float) points: number
	@Field(type => [GraphQLPublisher]) publishers: GraphQLPublisher[]
	@Field() releaseDate: Date
	@Field() releaseDateSplit: GraphQLReleaseDateSplit
	@Field(type => Int) reviewCount: number
	@Field(type => Float) score: number
	@Field(type => Int) trend: number
	@Field() updatedAt!: Date
	@Field(type => Int) version: number
	@Field(type => Int) visitCount: number
}

@ObjectType()
export class GraphQLSearchGame {
	@Field() _id: string
	@Field(type => [String]) alias: string[]
	@Field(type => Int) appid: number
	@Field() name: string
}
