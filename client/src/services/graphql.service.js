import { gqlFetch } from 'services/fetch.service.js'
import { sorting, filtering } from 'store/store.js'

import { isJsonEmpty } from 'services/helper.service.js'

export function getGame({ id }) {
	return new Promise(async (resolve, reject) => {
		gqlFetch(getGameQuery(id)).then(res => resolve(res))
	})
}

export function getGameListGames({ limit = 20, skip = 0, sort = '{}', filter = '{}' }) {
	return new Promise(async (resolve, reject) => {
		gqlFetch(getGameListQuery(limit, skip, sort, filter)).then(res => resolve(res))
	})
}

const defaultQuery = `_id appid name`

export function getGameSearchGames({ query = defaultQuery, limit = 20, skip = 0, sort = {}, filter = {} }) {
	return new Promise((resolve, reject) => {
		gqlFetch(getGameSearchQuery(query, skip, limit, sort, filter))
			.then(data => resolve(data))
			.catch(error => {
				reject(error)
			})
	})
}

let count = 0

export function buildQuery() {
	return new Promise((resolve, reject) => {
		// console.log(`Running BuildQuery from ${process.browser === true ? 'Browser' : 'Server'} for the ${++count} time`)

		// filtering.setDeveloper('Obsidian Entertainment')

		let query = '_id appid name '
		let sort = '{'
		let filter = '{'

		let sortingOptions
		let filterOptions

		sorting.subscribe(value => (sortingOptions = value))()
		filtering.subscribe(value => (filterOptions = value))()

		let { achievementCount, difficulty, points, score, trend, releaseDate } = sortingOptions
		let { genres, difficulty: difficultyFilter, platform, isFree } = filterOptions

		/* #region  Sorting Options */
		if (difficulty !== 0) {
			query += 'difficulty{average} '
			sort += `difficulty:${difficulty} `
		}

		if (achievementCount !== 0) {
			query += 'achievementCount '
			sort += `achievementCount:${achievementCount} `
		}

		if (points !== 0) {
			query += 'points '
			sort += `points:${points} `
		}

		if (score !== 0) {
			query += 'score '
			sort += `score:${score} `
		}

		if (trend !== 0) {
			query += 'trend '
			sort += `trend:${trend} `
		}

		if (releaseDate !== 0) {
			query += 'releaseDate '
			sort += `year:${releaseDate} month:${releaseDate} `
		}
		/* #endregion */

		/* #region  Filter Options */
		if (genres.length > 0 && genres !== undefined) {
			filter += `genres:${JSON.stringify(genres)} `
			query += 'genres{type} '
		}

		if (difficultyFilter !== undefined) {
			filter += `difficulty:{min:${difficultyFilter} max:${difficultyFilter + 10}} `
			query += 'difficulty{average} '
		}

		if (platform !== 'ANY') {
			filter += `platform:${platform} `
			query += 'platforms '
		}

		if (isFree !== undefined) {
			filter += `isFree:${isFree} `
			query += 'isFree '
		}
		/* #endregion */

		sort += '}'
		filter += '}'

		// console.log(query)

		resolve({
			query,
			sort,
			filter,
		})
	})
}

function getGameSearchQuery(query, skip, limit, sort, filter) {
	return `
    {
      games(limit: ${limit},skip:${skip}, sortBy: ${sort},filterBy:${filter}) {
        ${query}
      }
    }
  `
}

function getGameQuery(id) {
	return `
    {
      gameById(id:"${id}"){
        name
        _id
        appid
        achievements{
          name
          _id
          value
        }
      }
    }
  `
}

function getGameListQuery(limit, skip, sort, filter) {
	return `
      {
        games(limit: ${limit},skip:${skip}, sortBy: ${sort},filterBy:${filter}) {
          name
          difficulty {
            average
          }
          platforms
          genres {
            type
          }
          isFree
          releaseDate
          appid
          score
          points
          achievementCount
          _id
        }
      }`
}
