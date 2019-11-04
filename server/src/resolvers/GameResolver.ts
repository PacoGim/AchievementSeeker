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
	@Field({ nullable: true }) year: number
	@Field({ nullable: true }) month: number
	@Field({ nullable: true }) trend: number
}
/* #endregion */

/* #region  InputType QueryFilterBy */
@ObjectType()
@InputType('QueryFilterByInput')
export class QueryFilterBy {
	@Field({ nullable: true }) hasCeleste: boolean
	@Field({ nullable: true }) isFree: boolean
	@Field(type => Platform, { nullable: true }) platform: Platform
	@Field({ nullable: true }) difficulty: number
	@Field({ nullable: true }) year: number
	@Field({ nullable: true }) month: number
}
/* #endregion */

/* #region  ArgsType GetGamesArgs */
@ArgsType()
class GetGamesArgs {
	@Field(type => Int, { defaultValue: 0 })
	skip: number

	@Field(type => Int)
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
		$lt: number
	}
	'releaseDateSplit.year'?: {
		$eq: number
	}
	'releaseDateSplit.month'?: {
		$eq: number
	}
}
/* #endregion */

/* #region  Interface SortOptionObject */
interface ISortOptionObject {
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
				filter['difficulty.average'] = { $gte: filterBy['difficulty'], $lt: filterBy['difficulty'] }
			}

			if (filterBy['year'] !== undefined) {
				filter['releaseDateSplit.year'] = { $eq: filterBy['year'] }
			}

			if (filterBy['month'] !== undefined) {
				filter['releaseDateSplit.month'] = { $eq: filterBy['month'] }
			}
		}

		if (sortBy !== undefined) {

			console.log(sortBy)

			if (sortBy['difficulty'] !== undefined) {
				sort['difficulty.average'] = sortBy['difficulty']
			}

			if (sortBy['name'] !== undefined) {
				sort['name'] = sortBy['name']
			}

			if (sortBy['year'] !== undefined) {
				sort['releaseDateSplit.year'] = sortBy['year']
			}

			if (sortBy['month'] !== undefined) {
				sort['releaseDateSplit.month'] = sortBy['month']
			}

			if (sortBy['trend'] !== undefined) {
				sort['trend'] = sortBy['trend']
			}
		}

		console.log(sort)

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
