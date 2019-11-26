import { writable } from 'svelte/store'

export default function() {
	let filterValues = {
		genres: [],
		difficulty: undefined,
		isFree: undefined,
		platform: 'ANY',
	}

	const { subscribe, update } = writable(filterValues)

	return {
		subscribe,
		setGenres: genres =>
			update(filterValues => {
				console.log('Updating Genres', genres)
				filterValues['genres'] = genres
				return filterValues
			}),
		setDifficulty: difficulty =>
			update(filterValues => {
				console.log('Updating Difficulty', difficulty)
				filterValues['difficulty'] = difficulty
				return filterValues
			}),
		setPlatform: platform =>
			update(filterValues => {
				console.log('Updating Platform', platform)
				filterValues['platform'] = platform
				return filterValues
			}),
		cycleIsFree: () =>
			update(filterValues => {
				switch (filterValues['isFree']) {
					case undefined:
						filterValues['isFree'] = 'true'
						break
					case 'true':
						filterValues['isFree'] = 'false'
						break
					case 'false':
						filterValues['isFree'] = undefined
						break
				}

				console.log('Updating isFree', filterValues['isFree'])

				return filterValues
			}),
	}
}
