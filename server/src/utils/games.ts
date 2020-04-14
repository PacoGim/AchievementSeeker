import GameCollection from '../database/collections/Game.collection'
import { IGame } from '../models/Game.model'

export function getGameById(id: string | number): Promise<IGame> {
	return new Promise(async resolve => {
		let games: IGame[] = await GameCollection.get()
			.find({ $or: [{ appid: Number(id) }, { _id: String(id) }] })
			.toArray()
		resolve(games[0])
	})
}
