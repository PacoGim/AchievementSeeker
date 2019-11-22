import { gqlFetch } from 'services/fetch.service.js'
import { sorting, filtering } from "store/store.js";

import { isJsonEmpty } from "services/helper.service.js"

export function getGame({ id }) {
  return new Promise(async (resolve, reject) => {
    gqlFetch(getGameQuery(id))
      .then(res => res.json())
      .then(game => resolve(game['data']['gameById']))
  })
}

export function getGameListGames({ limit = 20, skip = 0, sort = '{}', filter = '{}' }) {
  return new Promise(async (resolve, reject) => {
    gqlFetch(getGameListQuery(limit, skip, sort, filter))
      .then(res => res.json())
      .then(games => resolve(games["data"]["games"]))
  })
}

const defaultQuery = `_id appid name`

export function getGameSearchGames({ query = defaultQuery, limit = 20, skip = 0, sort = {}, filter = {} }) {
  return new Promise((resolve, reject) => {
    gqlFetch(getGameSearchQuery(query, skip, limit, sort, filter))
      .then(games => resolve(games))
      .catch(error=>{
        reject(error)
      })
  })
}

let count = 0

export function buildQuery(urlQuery = undefined) {
  return new Promise((resolve, reject) => {

    console.log(`Running BuildQuery from ${process.browser === true ? 'Browser' : 'Server'} for the ${++count} time`)

    // filtering.setDeveloper('Obsidian Entertainment')

    let query = '_id appid name '
    let sort = '{'
    let filter = '{'

    if (!isJsonEmpty(urlQuery)) {
      if (urlQuery['genres'] !== undefined) {
        filter += `genres:${urlQuery['genres']} `
        query += 'genres{type} '
      }

      if (urlQuery['developers'] !== undefined) {
        filter += `developers:${urlQuery['developers']} `
        query += 'developers{name} '
      }

      if (urlQuery['publishers'] !== undefined) {
        filter += `publishers:${urlQuery['publishers']} `
        query += 'publishers{name} '
      }

    } else {
      let sortingOptions
      let filterOptions

      sorting.subscribe(value => sortingOptions = value)()
      filtering.subscribe(value => filterOptions = value)()

      let { achievementCount, difficulty, points, score, trend, releaseDate } = sortingOptions
      let { genre, developer, publisher, difficulty: difficultyFilter, platform, isFree } = filterOptions

      /* #region  Sorting Options */
      if (difficulty !== 0) {
        query += "difficulty{average} ";
        sort += `difficulty:${difficulty} `;
      }

      if (achievementCount !== 0) {
        query += "achievementCount ";
        sort += `achievementCount:${achievementCount} `;
      }

      if (points !== 0) {
        query += "points ";
        sort += `points:${points} `;
      }

      if (score !== 0) {
        query += "score ";
        sort += `score:${score} `;
      }

      if (trend !== 0) {
        query += "trend ";
        sort += `trend:${trend} `;
      }

      if (releaseDate !== 0) {
        query += "releaseDate ";
        sort += `year:${releaseDate} month:${releaseDate} `;
      }
      /* #endregion */

      /* #region  Filter Options */
      if (genre !== 'none' && genre !== undefined && genre !== '') {
        filter += `genres:["${genre}"] `
        query += 'genres{type} '
      }

      if (developer !== 'none' && developer !== undefined && developer !== '') {
        filter += `developers:["${developer}"] `
        query += 'developers{name} '
      }

      // console.log('GQL Service',publisher)

      if (publisher !== 'none' && publisher !== undefined && publisher !== '') {
        filter += `publishers:["${publisher}"] `
        query += 'publishers{name} '
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
    }

    sort += "}";
    filter += "}";

    // console.log(filter)

    resolve({
      query,
      sort,
      filter
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
