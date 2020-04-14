import { Collection } from 'mongodb'
import { IGame } from '../../models/Game.model'

let gameCollection: Collection<IGame>

export default {
	get(): Collection<IGame> {
		return gameCollection
	},

	set(collection: Collection<any>) {
		gameCollection = collection
	},
}
