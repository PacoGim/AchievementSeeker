import { IAchievement } from './AchievementEntity'
import { IDifficulty } from './DifficultyEntity'
import { IReleaseDateSplit } from './ReleaseDateSplitEntity'

export enum Platform {
	WINDOWS = 'windows',
	LINUX = 'linux',
	MAC = 'mac',
	ANY = 'any',
	ALL = 'all',
}

export interface IGame {
	[index: string]: any
	_id: string
	achievementCount?: number
	achievements?: IAchievement[]
	age: number
	alias?: string[]
	appid: number
	backgrounds: string[]
	createdAt: Date
	developers: string[]
	difficulty: IDifficulty
	genres: string[]
	isFree: boolean
	name: string
	platforms: string[]
	points?: number
	publishers: string[]
	releaseDate: Date
	releaseDateSplit: IReleaseDateSplit
	reviewCount?: number
	score?: number
	trend?: number
	updatedAt: Date
	version: number
	visitCount: number
}

// constructor(name: string, appid: number, _id: string, alias: string[], difficulty: Difficulty, platforms: string[], genres: Genre[], achievements: Achievement[], backgrounds: string[], popularity: Popularity, isFree: boolean, releaseDate: Date, age: number, score: number, points: number, achievementCount: number, updatedAt: Date, createdAt: Date, version: number, developers: Developer[], publishers: Publisher[]) {
// 	this.name = name
// 	this.appid = appid
// 	this._id = _id
// 	this.alias = alias
// 	this.difficulty = difficulty
// 	this.platforms = platforms
// 	this.genres = genres
// 	this.achievements = achievements
// 	this.backgrounds = backgrounds
// 	this.createdAt = createdAt
// 	this.developers = developers
// 	this.popularity = popularity
// 	this.isFree = isFree
// 	this.releaseDate = releaseDate
// 	this.age = age
// 	this.score = score
// 	this.points = points
// 	this.achievementCount = achievementCount
// 	this.updatedAt = updatedAt
// 	this.version = version
// 	this.publishers = publishers
// }
