import { gqlFetch } from 'services/fetch.service.js'

export function getGame({ id }) {
	return new Promise(async (resolve, reject) => {
		gqlFetch(getGameQuery(id))
			.then(res => res.json())
			.then(game => resolve(game['data']['gameById']))
	})
}

export function getGameListGames({ limit = 20, sort = '{}', filter = '{}' }) {
	return new Promise(async (resolve, reject) => {
		gqlFetch(getQueryGameList(limit, sort, filter))
			.then(res => res.json())
			.then(game => resolve(game["data"]["games"]))
	})
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

function getQueryGameList(limit, sort, filter) {
	return `
      {
        games(limit: ${limit}, sortBy: ${sort},filterBy:${filter}) {
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

// export const QueryGameList=Object.assign(, )
