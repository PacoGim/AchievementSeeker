import { Collection } from 'mongodb'
import { GameType } from '../../types/Game.type'

let gameCollection: Collection<GameType>

export default {
	get(): Collection<GameType> {
		return gameCollection
	},

	set(collection: Collection<any>) {
		gameCollection = collection
	},
}
