import fetch from 'node-fetch'

import { IServer } from '../utils/servers'
import { GameCollection } from '../database/collections/Game.collection'
import { UserCollection } from '../database/collections/User.collection'
import { UserGameQueueType, UserType } from '../types/User.type'
import { ObjectId } from 'mongodb'

export let userQueue: UserGameQueueType[] = []
let userGameToUpdate: any[] = []
let isfetchUserGameRunning = false
let isUserGameToUpdateRunning = false

let servers: IServer[] = Array(20)
	.fill(0)
	.map((x, i) => {
		return {
			id: i + 1,
			busy: false
		}
	})

observeArray(userQueue, ['push', 'unshift'], () => {
	if (!isfetchUserGameRunning) {
		isfetchUserGameRunning = true
		servers.forEach(() => {
			setUserAndServer()
		})
	}
})

observeArray(userGameToUpdate, ['push'], () => {
	if (!isUserGameToUpdateRunning) {
		isUserGameToUpdateRunning = true
		updateUserGame()
	}
})

function setUserAndServer() {
	let userGame = userQueue.shift()

	if (userGame) {
		// Looks for a server with busy set to false
		let availableServer = servers.find((server) => {
			if (server['busy'] === false) {
				server['busy'] = true
				return true
			}
		})

		if (availableServer === undefined) {
			userQueue.unshift(userGame)
		} else {
			fetchUserAchievements(userGame, availableServer)
		}

		setTimeout(() => {
			setUserAndServer()
		}, 2000)
	} else {
		isfetchUserGameRunning = false
	}
}

let counter = 0

function fetchUserAchievements(user: UserGameQueueType, server: IServer) {
	// Fetch user achievement for game
	fetch(`https://us-central1-sth-functions.cloudfunctions.net/fetchUserGame${server['id']}?appid=${user['appId']}&key=${process.env.STEAM_API_KEY}&steamid=${user['steamId']}`)
		.then((res) => res.json())
		.then(async (data) => {
			// List of db games achievement id that the user has achieved to fill later
			let userAchievedAchievements: number[] = []

			// All user steam achievements for given game
			let achievements = data?.['playerstats']?.['achievements']

			if (!achievements) return

			// Get game from db
			let game = await GameCollection.findOne({ _id: new ObjectId(user['gameId']) }, { projection: { name: 1, 'achievements._id': 1, 'achievements.steamName': 1, 'achievements.value': 1 } })

			// Should never happen since all games were previously added from the database
			if (!game) return

			// Iterate through steam achievements to find which game the user has achieved
			for (let achievement of achievements) {
				if (achievement['achieved'] === 1) {
					// Looks for the matching achievement inside the game object from the database
					let foundAchievement = game['achievements'].find((dbAchievement) => dbAchievement['steamName'] === achievement['name'])

					// If this gives false, it means that a game as added to the database.developer added an achievement to his
					// game and the user achieved it BEFORE it w
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

			// Sorts user achievements since the ids are simply numbers. Just so it's nice and tidy.
			userAchievedAchievements = userAchievedAchievements.sort((a, b) => a - b)

			// Checks if a game has a rainbow achievement
			let gameHasRainbowAchievement = game['achievements'].find((achievement) => achievement['value'] === 4)

			// If User has ALL achievements AND the game has a rainbow achievement
			if (gameHasRainbowAchievement && game['achievements'].length === achievements.length + 1) {
				userAchievedAchievements.push(gameHasRainbowAchievement['_id'])
			}

			userGameToUpdate.push({
				gameId: user['gameId'],
				userId: user['userId'],
				gameName: game['name'],
				userAchievedAchievements
			})
		})
		.catch((error) => {
			console.log(`User ${user['userId']} with game ${user['appId']} had an error ${error}`)
			userQueue.unshift(user)
		})
		.finally(() => {
			server['busy'] = false
		})
}

async function updateUserGame() {
	let userData = userGameToUpdate.shift()

	// console.log(userData)

	if (userData) {
		// Find the user in the database
		let dbUser = await UserCollection.findOne({ _id: userData['userId'] })

		// User not found should not happen since it was just created
		if (dbUser?.['games']) {
			// Looks in the user games wich game to update
			let foundGame = dbUser['games'].find((game) => new ObjectId(game['_id']).toHexString() === new ObjectId(userData['gameId']).toHexString())

			// Again, the game is obviously in the user array since it was added just before
			if (!foundGame) return

			// Updates the achievements
			foundGame['achievements'] = userData['userAchievedAchievements']

			// Updates the user
			await UserCollection.updateOne({ _id: dbUser['_id'] }, { $set: dbUser }, { upsert: true })

			console.log(++counter, `User ${userData['userId']} updated game ${userData['gameName']}.`, foundGame['achievements'])
			updateUserGame()
		} else {
			console.log('User Games not found')
		}
	} else {
		isUserGameToUpdateRunning = false
	}
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
