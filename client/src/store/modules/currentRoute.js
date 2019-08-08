import { writable } from 'svelte/store'

export default function () {
	const { subscribe, update } = writable('')

	return {
		subscribe,
		set: function(newRoute) {
			document.querySelector('route-name').style.opacity = 0
			setTimeout(() => {
				document.querySelector('route-name').style.opacity = 1
				return update(route => (route = newRoute))
			}, 500)
		},
	}
}
