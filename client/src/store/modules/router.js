import { writable } from 'svelte/store'

import { currentRoute } from 'store/store.js'

export default function() {
	const routes = [
		{
			id: 'home-route',
			to: '/',
			name: 'Home',
		},
		{
			id: 'game-list-route',
			to: 'game/list',
			name: 'Game List',
			rel: 'prefetch',
		},
		{
			id: 'game-search-route',
			to: 'game/search',
			name: 'Search Game',
		},
		{
			id: 'register',
			to: 'user/register/NzY1NjExOTgwNTM3MjI0NDI',
			name: 'Regsiter w/ user'
		},
		{
			id: 'register',
			to: 'user/register',
			name: 'Register'
		},
	]

	const { subscribe, update } = writable(routes)

	return {
		subscribe,
		setRouteActive: function(newRoute) {
			let routeFound = false
			let routeFoundName = ''

			for (let route of routes) {
				if (route['name'] === newRoute) {
					route['isActive'] = true
					routeFoundName = route['name']
					routeFound = true
				} else {
					delete route['isActive']
				}
			}

			routeFound ? currentRoute.set(routeFoundName) : currentRoute.set('')

			return update(routes => (routes = routes))
		},
	}
}