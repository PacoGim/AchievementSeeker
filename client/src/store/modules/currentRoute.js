import { writable } from 'svelte/store'

export default function() {
	const { subscribe, update } = writable('')

	return {
		subscribe,
		set: function(newRoute) {
			document.querySelector('route-name').style.opacity = 0
			document.querySelector('route-name').style.transform = 'translateY(-100px)'
			setTimeout(() => {
				document.querySelector('route-name').style.opacity = 1
				document.querySelector('route-name').style.transform = 'translateY(0px)'
				return update(route => (route = newRoute))
			}, 500)
		},
	}
}
