import { writable } from 'svelte/store'

const baseValues = [0, 1, -1]

let sortReleaseDateIndex = 0

export const sortReleaseDate = writable(baseValues[sortReleaseDateIndex])

sortReleaseDate.subscribe(value => {
	if (value === undefined) {
		sortReleaseDateIndex = (baseValues[sortReleaseDateIndex] + 1) % 3
		sortReleaseDate.set(baseValues[sortReleaseDateIndex])
	}
})
