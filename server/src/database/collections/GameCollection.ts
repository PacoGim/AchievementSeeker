import { Collection } from 'mongodb'
import { IGame } from '../../entities/GameEntity'

let gameCollection: Collection<IGame>

export default {
	get(): Collection<IGame> {
		return gameCollection
	},

	set(collection: Collection<any>) {
		gameCollection = collection
	},
}
