import { Collection } from 'mongodb'

let collections: { [index: string]: Collection } = {}

export default {
	/**
	 * Returns an object containing all the collections from the connected DB.
	 *
	 * @returns {Object}
	 */
	getCollections(): Object {
		return collections
	},

	/**
	 * Returns the collection based on the name parameter.
	 *
	 * @param {string} name
	 * @returns {Collection}
	 */
	getCollection(name: string): Collection {
		return collections[name]
	},

	/**
	 * Sets the passed collection to the collection list.
	 *
	 * @param {string} name
	 * @param {Collection} collection
	 */
	addCollection(name: string, collection: Collection) {
		collections[name] = collection
	},
}
