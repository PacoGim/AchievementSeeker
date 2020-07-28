import fetch from 'node-fetch'

import { ObjectId } from 'mongodb'

import { GameCollection } from '../database/collections/Game.collection'
import { UserCollection } from '../database/collections/User.collection'

import { userQueue } from '../utils/queue'
import { GameType } from '../types/Game.type'

export async function fetchUserGames(userId: ObjectId, steamId: string) {
	let userGames = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&format=json`).then((res) => res.json())

	if (userGames?.['response']?.['games']) {
		userGames = userGames['response']['games']

		console.log('userGames ', userGames.length)

		// Only keep appids for now
		let allUserGamesAppid = userGames.map((game: any) => game['appid'])

		console.log('allUserGamesAppid ', allUserGamesAppid.length)

		// Get the games from the DB that matches the user games
		let dbMatchingUserGames = await GameCollection.find({ appid: { $in: allUserGamesAppid } })
			.project({ _id: 1, appid: 1 })
			.toArray()

		console.log('dbMatchingUserGames ', dbMatchingUserGames.length)

		// Filter out unplayed games and Map only AppIds from the user games
		let playedGamesAppids = userGames.filter((game: any) => game['playtime_forever'] > 0).map((game: any) => game['appid'])

		console.log('userPlayedGamesAppids ', playedGamesAppids.length)

		// Keeps only user games played and pushes to the reactive queueing array
		let playedDbGames = dbMatchingUserGames.filter((game: any) => playedGamesAppids.includes(game['appid']))

		console.log('playedDbGames ', playedDbGames.length)

		// Get User from DB
		let userFound = await UserCollection.findOne({ _id: userId })

		if (userFound) {
			// Iterates through every game and gives back an array of objects just as placeholder
			userFound['games'] = dbMatchingUserGames.map((game: GameType) => {
				return {
					_id: game['_id'],
					achievements: []
				}
			})

			// Saves the new game array to db
			await UserCollection.updateOne({ _id: userId }, { $set: userFound }, { upsert: true })

			playedDbGames.forEach((game) => {
				userQueue.push({ userId, steamId, gameId: game['_id'], appId: game['appid'] })
			})
		}

		// UserCollection.deleteOne({ _id: userId })
	} else {
		//TODO: What to do if Steam doesn'y give back a good response 🤷‍♀️
		// console.log('I Dont Work')
	}
}
