import { gqlFetch } from 'services/fetch.service.js'
import { sortAchievementAmount, sortDifficulty,sortPoints } from "store/store.js";

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
      .then(res => res.json())
      .then(game => resolve(game["data"]["games"]))
  })
}

let count = 0

export function buildQuery(urlQuery = undefined) {
  return new Promise((resolve, reject) => {

    console.log(`Running BuildQuery from ${process.browser === true ? 'Browser' : 'Server'} for the ${++count} time`)

    let query = '_id appid name '
    let sort = '{'
    let filter = '{'

    if (!isJsonEmpty(urlQuery)) {

      console.log(urlQuery)

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
      let achievementCount
      let difficulty
      let points
      sortAchievementAmount.subscribe(value => achievementCount = value)()
      sortDifficulty.subscribe(value => difficulty = value)()
      sortPoints.subscribe(value => points = value)()

      if (difficulty !== 2) {
        query += "difficulty{average} ";
        sort += `difficulty:${difficulty === 0 ? "-1" : "1"} `;
      }

      if (achievementCount !== 2) {
        query += "achievementCount ";
        sort += `achievementCount:${achievementCount === 0 ? "-1" : "1"} `;
      }

      if (points !== 2) {
        query += "points ";
        sort += `points:${points === 0 ? "-1" : "1"} `;
      }
    }


    sort += "}";
    filter += "}";


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
