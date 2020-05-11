import { IUserGameQueue } from '../models/User.model'

import { servers, IServer } from '../utils/servers'

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
	//TODO Fetch User Game Achievements & Save. If Fails, put back the user in queue


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
