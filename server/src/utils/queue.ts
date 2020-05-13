import fetch from 'node-fetch'

import { debugWrite } from '../debug'

import { IUserGameQueue } from '../models/User.model'

import { servers, IServer } from '../utils/servers'
import GameCollection from '../database/collections/Game.collection'
import UserCollection from '../database/collections/User.collection'

export let userQueue: IUserGameQueue[] = []
let isfetchUserGameRunning = false

observeArray(userQueue, ['push'], () => {
	if (!isfetchUserGameRunning) {
		servers.forEach(() => {
			setUserAndServer()
		})
	}
})

function setUserAndServer() {
	isfetchUserGameRunning = true
	let user = userQueue.shift()

	if (user) {
		let availableServer = servers.find((server) => {
			if (server['busy'] === false) {
				server['busy'] = true
				return true
			}
		})

		if (availableServer === undefined) {
			setTimeout(() => {
				//@ts-ignore
				userQueue.unshift(user)
				setUserAndServer()
			}, 1000)
		} else {
			fetchUserAchievements(user, availableServer)
		}

		setUserAndServer()
	} else {
		isfetchUserGameRunning = false
	}
}

function fetchUserAchievements(user: IUserGameQueue, server: IServer) {
	// Fetch user achievement for game
	fetch(`https://us-central1-sth-functions.cloudfunctions.net/fetchUserGame${server['id']}?appid=${user['appId']}&key=${process.env.STEAM_API_KEY}&steamid=${user['steamId']}`)
		.then((res) => res.json())
		.then(async (data) => {
			// List of db games achievement id that the user has achieved
			let userAchievedAchievements: number[] = []

			// All user steam achievements for given game
			let achievements = data?.['playerstats']?.['achievements']

			if (!achievements) return

			// Get game from db
			let game = await GameCollection.get().findOne({ _id: user['gameId'] }, { projection: { name: 1, 'achievements._id': 1, 'achievements.steamName': 1, 'achievements.value': 1 } })

			// Should never happen since all games were previously added from the database
			if (!game) return

			// Iterate through steam achievements to find which game the user has achieved
			for (let achievement of achievements) {
				if (achievement['achieved'] === 1) {
					// Looks for the matching achievement inside the game object from the database
					let foundAchievement = game['achievements'].find((dbAchievement) => dbAchievement['steamName'] === achievement['name'])

					// If this triggers, it means that a game developer added an achievement to his
					// game and the user achieved it BEFORE it was added to the database.
					if (foundAchievement) {
						userAchievedAchievements.push(foundAchievement['_id'])
					} else {
						/*TODO What to do if this triggers..
							A function that updates games on demand will be created.
							Here it will call this function.
							The user shall then be added to the end of the queue to let the
							game update to be done 👍
						*/
					}
				}
			}

			// Sorts user achievements since the ids are simple numbers. Just so it's nice and tidy.
			userAchievedAchievements = userAchievedAchievements.sort((a, b) => a - b)

			// Checks if a game has a celestial achievement
			let gameHasCelestialAchievement = game['achievements'].find((achievement) => achievement['value'] === 4)

			// If User has ALL achievements AND the game has a celestial achievement
			if (gameHasCelestialAchievement && game['achievements'].length === achievements.length + 1) {
				//@ts-ignore
				userAchievedAchievements.push(gameHasCelestialAchievement['_id'])
			}

			// Find the user in the database
			let dbUser = await UserCollection.get().findOne({ _id: user['userId'] })

			// If the user wasn't found should not happen since it was just created
			if (!dbUser) return

			// Looks finds in the user games wich game to update
			let foundGame = dbUser['games'].find((game) => game['_id'] === user['gameId'])

			// Again, the game is obviously in the user array since it was added just before
			if (!foundGame) return

			// Updates the achievements
			foundGame['achievements'] = userAchievedAchievements

			// Updates the user
			UserCollection.get().updateOne({ _id: user['userId'] }, { $set: dbUser }, { upsert: true })

			debugWrite(`User ${user['userId']} updated game ${user['appId']}.`)
		})
		.catch((error) => {
			console.log(error)
			debugWrite(`User ${user['userId']} with game ${user['appId']} had an error ${error}`)
			userQueue.unshift(user)
		})
		.finally(() => {
			server['busy'] = false
		})
}

function observeArray(arr: { [index: string]: any }, toObserve: string[], callback: Function) {
	toObserve.forEach((m: string) => {
		arr[m] = function () {
			//@ts-ignore
			let res = Array.prototype[m].apply(arr, arguments)
			callback.apply(arr, arguments)
			return res
		}
	})
}
