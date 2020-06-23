import { MongoClient, Collection } from 'mongodb'

import {set as GameCollectionSet} from './collections/Game.collection'
import {set as UserCollectionSet} from './collections/User.collection'
import { GameType } from '../types/Game.type'
import { UserType } from '../types/User.type'

export function connectToDB(dbName: string, uri: string): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
			client.connect(async (error: Error) => {
				if (error !== null) reject(error)

				setCollection(getCollectionFromDB('Games', dbName, client))
				setCollection(getCollectionFromDB('Users', dbName, client))

				resolve('DB Ready')
			})
		} catch (error) {
			reject(error)
		}
	})
}

function getCollectionFromDB(collectionName: string, dbName: string, client: MongoClient): Collection<GameType | UserType> {
	let collection: Collection<GameType | UserType> = client.db(dbName).collection(collectionName)

	return collection
}

function setCollection(collection: Collection<GameType | UserType>) {
	const collectionName = collection.collectionName
	switch (collectionName) {
		case 'Games':
			GameCollectionSet(collection)
			break
		case 'Users':
			UserCollectionSet(collection)
			break
	}

	console.log(`${collectionName} Loaded`)
}
