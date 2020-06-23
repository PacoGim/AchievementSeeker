import { GameCollection } from '../database/collections/Game.collection'
import { GameType } from '../types/Game.type'
import { stringToNumber, stringToObjectId } from '../utils/functions'
import { ObjectId } from 'mongodb'

export function getGameById(id: string): Promise<GameType> {
	return new Promise(async (resolve) => {
		if (GameCollection) {
			// console.log(GameCollection)
			let games: GameType[] = await GameCollection.find({ $or: [{ appid: stringToNumber(id) }, { _id: stringToObjectId(id) }] }).toArray()
			resolve(games[0])
		}
	})
}

type CustomGameOptionTypeProject = {
	name?: number
}

type CustomGameOptionTypeSort = {
	[key: string]: number | undefined
	name?: number
	releaseDate?: number
	score?: number
	points?: number
	achievementCount?: number
	'difficulty.average'?: number
}

type CustomGameOptionTypeFilter = {
	isFree?: boolean
	platforms?: string[]
	isCelestial?: boolean
	age?: number
	developers?: string[]
	publishers?: string[]
	genres?: string[]
	releaseDate?: {
		year: number
		month: number
		day: number
	}
}

type CustomGameOptionType = {
	games?: string[]
	project?: CustomGameOptionTypeProject
	sort?: CustomGameOptionTypeSort
	filter?: CustomGameOptionTypeFilter
	skip: number
	limit: number
}

export function getModularGames(options: CustomGameOptionType): Promise<GameType[]> {
	return new Promise(async (resolve, reject) => {
		let { games = [], project = {}, sort = {}, filter = {}, skip = 0, limit = 10 } = options

		let gamesFound: GameType[]

		let filterOptions = getFiltering(filter)
		let sortOptions = getSorting(sort)

		let appidList: number[] = []
		let objectIdList: ObjectId[] = []

		let findQuery = {}

		if (limit > 35) {
			return reject({
				errorCode: 'limitTooHigh',
				message: 'The limit given is too high. The maximun authorized is 35.'
			})
		}

		if (games.length > 0) {
			games.forEach((game) => {
				if (isNaN(Number(game))) {
					// Is NOT a number type
					try {
						objectIdList.push(new ObjectId(game))
					} catch {}
				} else {
					appidList.push(Number(game))
				}
			})

			findQuery = {
				$or: [{ appid: { $in: appidList } }, { _id: { $in: objectIdList } }]
			}

			// No need to filter if requesting specific games
			gamesFound = await GameCollection.find(findQuery).sort(sortOptions).project(project).skip(skip).limit(limit).toArray()
		} else {
			gamesFound = await GameCollection.find(findQuery).filter(filterOptions).sort(sortOptions).project(project).skip(skip).limit(limit).toArray()
		}

		resolve(gamesFound)
	})
}

function getSorting(sortOptions: CustomGameOptionTypeSort) {
	/*
		releaseDate: $sortReleaseDate,
					score: $sortScore,
					points: $sortPoints,
					achievementCount: $sortAchievements,
					'difficulty.average': $sortDifficulty
	*/
	for (let option in sortOptions) {
		if (sortOptions[option] === 0) {
			delete sortOptions[option]
		}
	}

	return sortOptions
}

function getFiltering(filterOptions: CustomGameOptionTypeFilter) {
	let mongoFilter = {}

	if (filterOptions?.['isFree']) {
		Object.assign(mongoFilter, { isFree: filterOptions['isFree'] })
	}

	if (filterOptions?.['platforms']) {
		Object.assign(mongoFilter, {
			platforms: {
				$in: filterOptions['platforms']
			}
		})
	}

	if (filterOptions?.['isCelestial'] === true) {
		Object.assign(mongoFilter, {
			achievements: {
				$elemMatch: { value: 4 }
			}
		})
	} else if (filterOptions?.['isCelestial'] === false) {
		Object.assign(mongoFilter, {
			achievements: {
				$not: {
					$elemMatch: { value: 4 }
				}
			}
		})
	}

	/*TODO: Fix issue with age being a string instead of a number in db. Also fixed steam fetching.
	 */
	if (filterOptions?.['age']) {
		Object.assign(mongoFilter, {
			age: {
				$lte: filterOptions['age']
			}
		})
	}

	if (filterOptions?.['developers']) {
		Object.assign(mongoFilter, {
			developers: {
				$in: filterOptions['developers']
			}
		})
	}

	if (filterOptions?.['publishers']) {
		Object.assign(mongoFilter, {
			publishers: {
				$in: filterOptions['publishers']
			}
		})
	}

	if (filterOptions?.['genres']) {
		Object.assign(mongoFilter, {
			genres: {
				$all: filterOptions['genres']
			}
		})
	}

	if (filterOptions?.['releaseDate']?.['year']) {
		Object.assign(mongoFilter, {
			'releaseDateSplit.year': filterOptions['releaseDate']['year']
		})
	}

	if (filterOptions?.['releaseDate']?.['month']) {
		Object.assign(mongoFilter, {
			'releaseDateSplit.month': filterOptions['releaseDate']['month']
		})
	}

	if (filterOptions?.['releaseDate']?.['day']) {
		Object.assign(mongoFilter, {
			'releaseDateSplit.day': filterOptions['releaseDate']['day']
		})
	}

	return mongoFilter
}

export function getGamesList() {
	return new Promise(async (resolve, reject) => {
		let gamesList = await GameCollection.find({}).project({ _id: 1, name: 1 }).toArray()
		resolve(gamesList)
	})
}

export function updateGame(id: string, newData: any) {
	return new Promise(async (resolve, reject) => {
		//TODO: Create a snapshot mechanism every time a game is updated (just in case)

		let game = await getGameById(id)

		let achievements = game['achievements']

		let newAchievements = newData['achievements']

		if (newAchievements !== undefined) {
			//TODO All of this is for the snaphot mechanisim
			for (let i = 0, length = achievements.length; i < length; i++) {
				if (hash(JSON.stringify(newAchievements[i])) !== hash(JSON.stringify(achievements[i]))) {
					console.log(achievements[i]['name'])
					console.log(achievements[i]['description'], newAchievements[i]['description'])
					console.log('-----------')
				}
			}
		}

		game['achievements'] = newAchievements

		//IMPORTANT Never reach this line in prod without doing a game data snapshot

		// console.log(game)

		GameCollection.updateOne({ _id: game['_id'] }, { $set: game }, (err, result) => {
			if (err) {
				console.log(err)
			} else {
				console.log(result)
			}
		})
	})
}

/*
	snapshotDate:new Date().now()
	_id:xxxxxxxx,
	achievements:[
		{
			id:0,
			description:'Complete the game in under 5 hours'
		}
	]
*/

function hash(text: string) {
	let hash = 0
	let i
	let chr

	for (i = 0; i < text.length; i++) {
		chr = text.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}
