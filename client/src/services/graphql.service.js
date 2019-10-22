import { gqlFetch } from 'services/fetch.service.js'

export function getGameListGames(notThis, limit = 20, sort = '{}', filter = '{}') {
	return new Promise(async (resolve, reject) => {
		let data = await gqlFetch(notThis, getQueryGameListBase(limit, sort, filter))
		resolve(data)
	})
}

function getQueryGameListBase(limit, sort, filter) {
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
        }
      }`
}

// export const QueryGameList=Object.assign(, )
