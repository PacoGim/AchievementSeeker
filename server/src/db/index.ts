import { MongoClient } from 'mongodb'
import { EventEmitter } from 'events'

const uri = 'mongodb://localhost:27017'
const dbName = 'AchievementSeeker'

import GameCollection from './collections/GameCollection'
import UserCollection from './collections/UserCollection'

export class DBConnector extends EventEmitter {
	client: MongoClient
	constructor() {
		super()
		this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	}

	connect() {
		let isDoneLoading = 2

		this.client.connect(async (err: Error) => {
			if (err) this.emit('err', err)
			else {
				this.client.db(dbName).collection('Games', (error, result) => {
					if (error) throw error
					else GameCollection.set(result)
					if (--isDoneLoading === 0) this.emit('connected')
				})

				this.client.db(dbName).collection('Users', (error, result) => {
					if (error) throw error
					else UserCollection.set(result)
					if (--isDoneLoading === 0) this.emit('connected')
				})
			}
		})
		return this
	}
}