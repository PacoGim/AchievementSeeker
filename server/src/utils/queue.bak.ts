// import IClient from './interfaces/IClient'

// import { generateClients } from './utils/helper'
// import { servers, IServer } from './utils/server'

// interface IClientGames {
// 	userId: number
// 	gameId: string
// }

// export let clients: IClient[] = []
// let clientsToProcess: IClientGames[] = []
// let isfetchUserGameRunning = false

// ;(function main() {
// 	observeArray(clients, ['push'], () => {
// 		let client = clients.shift()

// 		if (client) {
// 			client['games'].forEach((game) => {
// 				clientsToProcess.push({
// 					userId: client['id'],
// 					gameId: game
// 				})
// 			})
// 		}
// 	})

// 	observeArray(clientsToProcess, ['push'], () => {
// 		if (!isfetchUserGameRunning) {
// 			fetchUserGame()
// 		}
// 	})

// 	generateClients(10)

// 	// setTimeout(() => {
// 	// 	generateClients(3)
// 	// 	generateClients(3)
// 	// 	generateClients(3)
// 	// }, 4000);
// })()

// function fetchUserGame() {
// 	isfetchUserGameRunning = true

// 	let client = clientsToProcess.shift()

// 	if (client) {
// 		let server = servers.find((x) => {
// 			if (x['busy'] === false) {
// 				x['busy'] = true
// 				return true
// 			}
// 		})

// 		if (server === undefined) {
// 			setTimeout(() => {
// 				clientsToProcess.unshift(client)
// 				fetchUserGame()
// 			}, 1000)
// 		} else {
// 			processClient(client, server)
// 		}

// 		fetchUserGame()
// 	} else {
// 		isfetchUserGameRunning = false
// 	}
// }

// function processClient(client: IClientGames, server: IServer) {
// 	setTimeout(() => {
// 		server['busy'] = false
// 	}, 2000)
// }

// function observeArray(arr: { [index: string]: any }, toObserve: string[], callback: Function) {
// 	toObserve.forEach((m: string) => {
// 		arr[m] = function () {
// 			//@ts-expect-error
// 			let res = Array.prototype[m].apply(arr, arguments)
// 			callback.apply(arr, arguments)
// 			return res
// 		}
// 	})
// }
