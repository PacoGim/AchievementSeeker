import { writable } from 'svelte/store'

const baseValues = [0, 1, -1]

let sortReleaseDateIndex = 2

export const sortReleaseDate = writable(baseValues[sortReleaseDateIndex])

sortReleaseDate.subscribe(value => {
	if (value === undefined) {
		sortReleaseDateIndex = (baseValues[sortReleaseDateIndex] + 1) % 3
		sortReleaseDate.set(baseValues[sortReleaseDateIndex])
	}
})

let sortScoreIndex = 0

export const sortScore = writable(baseValues[sortScoreIndex])

sortScore.subscribe(value => {
	if (value === undefined) {
		sortScoreIndex = (baseValues[sortScoreIndex] + 1) % 3
		sortScore.set(baseValues[sortScoreIndex])
	}
})

let sortPointsIndex = 0

export const sortPoints = writable(baseValues[sortPointsIndex])

sortPoints.subscribe(value => {
	if (value === undefined) {
		sortPointsIndex = (baseValues[sortPointsIndex] + 1) % 3
		sortPoints.set(baseValues[sortPointsIndex])
	}
})

let sortAchievementsIndex = 0

export const sortAchievements = writable(baseValues[sortAchievementsIndex])

sortAchievements.subscribe(value => {
	if (value === undefined) {
		sortAchievementsIndex = (baseValues[sortAchievementsIndex] + 1) % 3
		sortAchievements.set(baseValues[sortAchievementsIndex])
	}
})

let sortDifficultyIndex = 0

export const sortDifficulty = writable(baseValues[sortDifficultyIndex])

sortDifficulty.subscribe(value => {
	if (value === undefined) {
		sortDifficultyIndex = (baseValues[sortDifficultyIndex] + 1) % 3
		sortDifficulty.set(baseValues[sortDifficultyIndex])
	}
})
