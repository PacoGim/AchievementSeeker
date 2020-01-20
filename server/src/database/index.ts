import { MongoClient, Collection } from 'mongodb'

import { IGame } from '../entities/GameEntity'
import { IUser } from '../entities/UserEntity'

import GameCollection from './collections/GameCollection'
import UserCollection from './collections/UserCollection'

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

function getCollectionFromDB(collectionName: string, dbName: string, client: MongoClient): Collection<IGame | IUser> {
	let collection: Collection<IGame | IUser> = client.db(dbName).collection(collectionName)

	return collection
}

function setCollection(collection: Collection<IGame | IUser>) {
	const collectionName = collection.collectionName
	switch (collectionName) {
		case 'Games':
			GameCollection.set(collection)
			break
		case 'Users':
			UserCollection.set(collection)
			break
	}

	console.log(`${collectionName} Loaded`)
}
