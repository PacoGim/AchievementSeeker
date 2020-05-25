import { ObjectId } from 'mongodb'

export type UserType = {
	_id?: ObjectId
	steamId: string
	games?: UserGamesType[]
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
