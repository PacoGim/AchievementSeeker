import { gqlFetch } from 'services/fetch.service.js'

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
