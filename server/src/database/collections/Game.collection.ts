import { Collection } from 'mongodb'
import { GameType } from '../../types/Game.type'

export let GameCollection: Collection<GameType>

export function set(collection: Collection<any>) {
	GameCollection = collection
}