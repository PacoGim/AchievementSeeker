const EventEmitter = require('events')
const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb://localhost:27017'

const client = new MongoClient(uri, { useNewUrlParser: true })

class DB extends EventEmitter {
	constructor(dbName, collectionName) {
		super()
		this.dbName = dbName
		this.collectionName = collectionName
		this.connectDB()
	}

	connectDB() {
		client.connect(async err => {
			if (err) this.emit('err', err)
			else {
				DB.collections[`${this.collectionName}`] = client.db(this.dbName).collection(this.collectionName)
				console.log(`${this.collectionName} Loaded`)
				this.emit('connected')
			}
		})
	}
}

DB.collections = {}

module.exports = DB
