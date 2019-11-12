import { Resolver, Query, Arg, FieldResolver, Root, Args, ArgsType, Field, ObjectType, InputType, Int, registerEnumType } from 'type-graphql'
import GameCollection from '../db/collections/GameCollection'
import { IGame, Platform } from '../entities/GameEntity'
import { Max } from 'class-validator'
import { GraphQLGame, GraphQLSearchGame } from '../entities/schemas/GameSchema'

registerEnumType(Platform, {
	name: 'Platform',
})

/* #region  InputType QuerySortBy */
@ObjectType()
@InputType('QuerySortByInput')
export class QuerySortBy {
	@Field({ nullable: true }) name: number
	@Field({ nullable: true }) releaseDate: number
	@Field({ nullable: true }) achievementCount: number
	@Field({ nullable: true }) difficulty: number
	@Field({ nullable: true }) score: number
	@Field({ nullable: true }) points: number
	@Field({ nullable: true }) trend: number
	@Field({ nullable: true }) month: number
	@Field({ nullable: true }) year: number
}
/* #endregion */

/* #region  InputType QueryFilterDifficulty */
@ObjectType()
@InputType('QueryFilterDifficulty')
class Difficulty {
	@Field() min: number
	@Field() max: number
}
/* #endregion */

/* #region  InputType QueryFilterBy */
@ObjectType()
@InputType('QueryFilterByInput')
class QueryFilterBy {
	@Field(type => [String], { nullable: true }) genres: string[]
	@Field(type => [String], { nullable: true }) developers: string[]
	@Field(type => [String], { nullable: true }) publishers: string[]
	@Field({ nullable: true }) hasCeleste: boolean
	@Field({ nullable: true }) isFree: boolean
	@Field(type => Platform, { nullable: true }) platform: Platform
	@Field(type => Difficulty, { nullable: true }) difficulty: Difficulty
	@Field({ nullable: true }) year: number
	@Field({ nullable: true }) month: number
}
/* #endregion */

/* #region  ArgsType GetGamesArgs */
@ArgsType()
class GetGamesArgs {
	@Field(type => Int, { defaultValue: 0 })
	skip: number

	@Field(type => Int, { nullable: true, defaultValue: 20 })
	@Max(40)
	limit: number

	@Field(type => QuerySortBy, { nullable: true })
	sortBy: QuerySortBy

	@Field(type => QueryFilterBy, { nullable: true })
	filterBy: QueryFilterBy
}
/* #endregion */

/* #region  Interface FilterOptionObject */
interface IFilterOptionObject {
	achievementCount?: {
		$gte?: number
		$lt?: number
	}
	isFree?: boolean
	platforms?: {
		$all?: Platform[]
	}
	'difficulty.average'?: {
		$gte: number
		$lte: number
	}
	'releaseDateSplit.year'?: {
		$eq: number
	}
	'releaseDateSplit.month'?: {
		$eq: number
	},
	genres?: {
		$in: string[]
	}
	developers?: {
		$in: string[]
	}
	publishers?: {
		$in: string[]
	}
}
/* #endregion */

/* #region  Interface SortOptionObject */
interface ISortOptionObject {
	score?: number
	releaseDate?: number
	achievementCount?: number
	points?: number
	'difficulty.average'?: number
	trend?: number
	name?: number
	'releaseDateSplit.month'?: number
	'releaseDateSplit.year'?: number
}
/* #endregion */

@Resolver(of => GraphQLGame)
export default class {
	/* #region  Query Games */
	@Query(returns => [GraphQLGame], { nullable: true })
	async games(@Args() { skip, limit, sortBy, filterBy }: GetGamesArgs): Promise<IGame[] | null> {
		let filter: IFilterOptionObject = {}
		let sort: ISortOptionObject = {}

		if (filterBy !== undefined) {
			if (filterBy['hasCeleste'] !== undefined) filterBy['hasCeleste'] === true ? (filter['achievementCount'] = { $gte: 15 }) : (filter['achievementCount'] = { $lt: 15 })

			if (filterBy['isFree'] !== undefined) filter['isFree'] = filterBy['isFree']

			if (filterBy['platform'] !== undefined) {
				switch (filterBy['platform']) {
					case 'windows':
						filter['platforms'] = { $all: [Platform.WINDOWS] }
						break
					case 'linux':
						filter['platforms'] = { $all: [Platform.LINUX] }
						break
					case 'mac':
						filter['platforms'] = { $all: [Platform.MAC] }
						break
					case 'all':
						filter['platforms'] = { $all: [Platform.WINDOWS, Platform.LINUX, Platform.MAC] }
						break
				}
			}

			if (filterBy['difficulty'] !== undefined) {
				filter['difficulty.average'] = { $gte: filterBy['difficulty']['min'], $lte: filterBy['difficulty']['max'] }
			}

			if (filterBy['year'] !== undefined) {
				filter['releaseDateSplit.year'] = { $eq: filterBy['year'] }
			}

			if (filterBy['month'] !== undefined) {
				filter['releaseDateSplit.month'] = { $eq: filterBy['month'] }
			}

			if (filterBy['genres'] !== undefined) {
				filter['genres'] = {
					$in: filterBy['genres']
				}
			}

			if (filterBy['developers'] !== undefined) {
				filter['developers'] = {
					$in: filterBy['developers']
				}
			}

			if (filterBy['publishers'] !== undefined) {
				filter['publishers'] = {
					$in: filterBy['publishers']
				}
			}
		}

		if (sortBy !== undefined) {

			if (sortBy['year'] !== undefined) {
				sort['releaseDateSplit.year'] = sortBy['year']
			}

			if (sortBy['month'] !== undefined) {
				sort['releaseDateSplit.month'] = sortBy['month']
			}

			if (sortBy['releaseDate'] !== undefined) {
				sort['releaseDate'] = sortBy['releaseDate']
			}

			if (sortBy['difficulty'] !== undefined) {
				sort['difficulty.average'] = sortBy['difficulty']
			}

			if (sortBy['points'] !== undefined) {
				sort['points'] = sortBy['points']
			}

			if (sortBy['achievementCount'] !== undefined) {
				sort['achievementCount'] = sortBy['achievementCount']
			}

			if (sortBy['name'] !== undefined) {
				sort['name'] = sortBy['name']
			}

			if (sortBy['score'] !== undefined) {
				sort['score'] = sortBy['score']
			}

			if (sortBy['trend'] !== undefined) {
				sort['trend'] = sortBy['trend']
			}

		}

		console.log('Server Sort',sort)

		console.log('Server Filter',filter)

		return await GameCollection.get()
			.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.collation({ locale: 'en' })
			.toArray()
	}
	/* #endregion */

	/* #region  Query GameByID */
	@Query(returns => GraphQLGame, { nullable: true })
	async gameById(@Arg('id') id: string): Promise<IGame | null> {
		return await GameCollection.get().findOne({ _id: id })
	}
	/* #endregion */

	/* #region  Query GameByAppID */
	@Query(returns => GraphQLGame, { nullable: true })
	async gameByAppId(@Arg('appid') appid: number): Promise<IGame | null> {
		return await GameCollection.get().findOne({ appid })
	}
	/* #endregion */

	/* #region  Query GamesByDevelopper */
	@Query(returns => [GraphQLGame], { nullable: true })
	async gamesByDeveloper(@Arg('name') name: string): Promise<IGame[] | null> {
		let result = await GameCollection.get()
			.find({ developers: { $in: [name] } })
			.toArray()
		return result
	}
	/* #endregion */

	/* #region  Query GamesByPulbisher */
	@Query(returns => [GraphQLGame], { nullable: true })
	async gamesByPublisher(@Arg('name') name: string): Promise<IGame[] | null> {
		let result = await GameCollection.get()
			.find({ publishers: { $in: [name] } })
			.toArray()
		return result
	}
	/* #endregion */

	/* #region  Query GamesByGenre */
	@Query(returns => [GraphQLGame], { nullable: true })
	async gamesByGenre(@Arg('name') name: string): Promise<IGame[] | null> {
		let result = await GameCollection.get()
			.find({ genres: { $in: [name] } })
			.toArray()
		return result
	}
	/* #endregion */

	/* #region  FieldResolver Developers */
	@FieldResolver()
	async developers(@Root() game: IGame) {
		let result = await GameCollection.get()
			.find({ _id: game._id })
			.project({ _id: 0, developers: 1 })
			.toArray()
		return result[0]['developers'].map(x => Object.assign({}, { name: x }))
	}
	/* #endregion */

	/* #region  FielResolver Publishers */
	@FieldResolver()
	async publishers(@Root() game: IGame) {
		let result = await GameCollection.get()
			.find({ _id: game._id })
			.project({ _id: 0, publishers: 1 })
			.toArray()
		return result[0]['publishers'].map(x => Object.assign({}, { name: x }))
	}
	/* #endregion */

	/* #region  FieldResolver Genres */
	@FieldResolver()
	async genres(@Root() game: IGame) {
		let result = await GameCollection.get()
			.find({ _id: game._id })
			.project({ _id: 0, genres: 1 })
			.toArray()
		return result[0]['genres'].map(x => Object.assign({}, { type: x }))
	}
	/* #endregion */
}
