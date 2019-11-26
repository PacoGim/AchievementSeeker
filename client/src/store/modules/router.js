import { writable } from 'svelte/store'

let setCurrentRouteStylesTimeout = undefined

export default function() {
	const routes = [
		{
			name: 'Achievement Seeker',
			id: 'home-route',
			to: '/',
			rel: 'prefetch',
		},
		{
			name: 'Game List',
			id: 'game-list-route',
			to: 'game/list',
		},
		{
			name: 'Register w/ user',
			id: 'register-route',
			to: 'user/register/NzY1NjExOTgwNTM3MjI0NDI',
		},
		{
			name: 'Register',
			id: 'register-route',
			to: 'user/register',
		},
	]

	const currentRoute = ''

	const { subscribe, update } = writable({
		routes,
		currentRoute,
	})

	return {
		subscribe,
		setActiveRoute(newRoute) {
			let currentRouteMatched = ''

			// Iterates through the routes and sets the current route as active.
			for (let route of routes) {
				if (route['name'] === newRoute) {
					route['isActive'] = true
					currentRouteMatched = route['name']
				} else {
					delete route['isActive']
				}
			}

			update(() => {
				return {
					routes,
					currentRoute,
				}
			})

			this.setRouteName(currentRouteMatched)
		},
		setRouteName(newRouteName) {
			setRouteNameStyles(0, 'translateY(-100px)')

			clearTimeout(setCurrentRouteStylesTimeout)

			setCurrentRouteStylesTimeout = setTimeout(() => {
				setRouteNameStyles(1, 'translateY(0px)')

				update(() => {
					return {
						routes,
						currentRoute: newRouteName,
					}
				})
			}, 500)
		},
	}
}

function setRouteNameStyles(opacity, transform) {
	let $routeName = document.querySelector('route-name').style
	$routeName.opacity = opacity
	$routeName.transform = transform
}
