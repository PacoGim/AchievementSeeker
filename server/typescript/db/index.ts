import { MongoClient } from 'mongodb'
import { EventEmitter } from 'events'

import collections from './collections'

const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })


export class DBConnector extends EventEmitter {
	dbName: string

	constructor(dbName: string) {
		super()
		this.dbName = dbName
	}

	connect() {
		client.connect(async (err: Error) => {
			if (err) this.emit('err', err)
			else {
				client.db(this.dbName).collections((error, result) => {
					result.forEach(collection => {
						collections.addCollection(collection['collectionName'], collection)
						console.log(`${collection['collectionName']} Collection Loaded.`)
					})
					console.log(`${this.dbName} Collections Loaded.`)
					this.emit('connected')
				})
			}
		})
		return this
	}
}

/*
interface Index {
	collectionName: string
	indexes: Array<IndexSpecification>
}

createIndexes(indexesArray: Array<Index>) {
	let counter: number = indexesArray.length

	for (let index of indexesArray) {
		let collectionName = index['collectionName']

		let collection = client.db(this.dbName).collection(collectionName)

		collection.createIndexes(index['indexes'], (err, result) => {
			if (err) {
				console.log(`Error creating index for collection ${collectionName} of DB ${this.dbName}`)
			} else {
				console.log(result)
				collections.addCollection(collectionName, collection)
			}

			if (--counter === 0) {
				this.emit('index done')
				return this
			}
		})
	}
}

DB.createIndexes([
			{
				collectionName: 'Test',
				indexes: [
					{
						key: {
							appid: 1,
						},
						unique: true,
					},
				],
			},
			{
				collectionName: 'Games',
				indexes: [
					{
						key: {
							appid: 1,
						},
						unique: true,
					},
				],
			},
		])
*/