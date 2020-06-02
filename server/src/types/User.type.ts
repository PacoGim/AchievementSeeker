import { ObjectId } from 'mongodb'
import { UserGameAchievementType } from './Game.type'

export type UserType = {
	_id?: ObjectId
	steamId?: string
	games?: UserGamesType[]
	game?: UserGameAchievementType
}

type UserGamesType = {
	_id: ObjectId
	achievements: number[]
}

export type UserGameQueueType = {
	appId: number
	gameId: ObjectId
	userId: ObjectId
	steamId: string
}

export type UserGameType = {}

export type UserModulesType = {
	id: string
	games: (string | number)[]
}
