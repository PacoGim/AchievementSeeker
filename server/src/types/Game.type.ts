import { ObjectId } from 'mongodb'
import { AchievementType } from './Achievement.type'

type DifficultyType = {
	easy: number
	medium: number
	hard: number
}

type DateSplitType = {
	year: number
	month: number
	day: number
}

export type GameType = {
	_id: ObjectId
	achivementCount: number
	achievements: AchievementType[]
	age: number
	alias: string[]
	appid: number
	backgrounds: string[]
	createdAt: Date
	developers: string[]
	difficulty: DifficultyType
	genres: string[]
	isFree: boolean
	name: string
	platforms: string[]
	points: number
	publishers: string[]
	releaseDate: Date
	releaseDateSplit: DateSplitType
	reviewCount: number
	score: number
	trend: number
	updatedAt: Date
	version: number
	visitCount: number
}

export type UserGameAchievementType = {
	_id: ObjectId
	achievements: number[]
}
