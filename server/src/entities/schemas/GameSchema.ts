import { ObjectType, Field, Int, Float } from 'type-graphql'
import { GraphQLDifficulty } from './DifficultySchema'
import { GraphQLAchievement } from './AchievementSchema'
import { GraphQLDeveloper } from './DeveloperSchema'
import { GraphQLPublisher } from './PublisherSchema'
import { GraphQLGenre } from './GenreSchema'
import { GraphQLReleaseDateSplit } from './ReleaseDateSplitSchema'

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
