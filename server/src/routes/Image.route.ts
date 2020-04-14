import Router from 'koa-router'

import { hashCode, errorHandler, genNum } from '../utils/functions'
import { getGameById } from '../utils/games'
import { getFilePaths, sendImageResponse } from '../utils/image'

import { IUrls } from '../models/Urls.model'

const router = new Router({ prefix: '/image' })

const baseSteamUrl = 'https://steamcdn-a.akamaihd.net/steam/apps/'

const urls: IUrls = {
	header: (appid: number) => `${baseSteamUrl}${appid}/header.jpg`,
	smallCapsule: (appid: number) => `${baseSteamUrl}${appid}/capsule_sm_120.jpg`,
	bigCapsule: (appid: number) => `${baseSteamUrl}${appid}/capsule_616x353.jpg`,
	logo: (appid: number) => `${baseSteamUrl}${appid}/logo.png`,
	hero: (appid: number) => `${baseSteamUrl}${appid}/library_hero.jpg`,
	library: (appid: number) => `${baseSteamUrl}${appid}/library_600x900.jpg`,
	background: (appid: number, backgroundUrl: string) => `${baseSteamUrl}${appid}/${backgroundUrl}`,
	achievement: (appid: number, achievementId: string) => `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${achievementId}`,
}

router.get('/achievement/:id/:achId/:isGray*', async ctx => {
	try {
		const { id, achId, isGray } = ctx['params']

		const game = await getGameById(id)

		if (game === undefined) throw new Error(`Game with id/appid: ${id} does not exist`)

		const { achievements } = game

		const achievement = achievements.find(i => i['_id'] === Number(achId))

		if (achievement === undefined) throw new Error(`Achievement with id: ${achId}, not found`)

		const achName = isGray !== 'true' ? achievement['img'] : achievement['imgGray']
		const fetchUrl = urls['achievement'](game['appid'], achName)
		const { dirPath, filePath } = getFilePaths(game['name'], game['_id'], hashCode(achName), 'achievements')

		await sendImageResponse(ctx, filePath, fetchUrl, dirPath)
	} catch (error) {
		errorHandler(error, ctx)
	}
})

router.get('/background/:id', async ctx => {
	try {
		const { id } = ctx['params']

		const game = await getGameById(id)

		if (game === undefined) throw new Error(`Game with id/appid: ${id} does not exist`)

		const { backgrounds } = game
		const backgroundUrl = backgrounds[genNum(0, backgrounds.length - 1)]

		let fetchUrl = urls['background'](game['appid'], backgroundUrl)

		ctx['body'] = fetchUrl

		const { dirPath, filePath } = getFilePaths(game['name'], game['_id'], hashCode(backgroundUrl), 'backgrounds')

		await sendImageResponse(ctx, filePath, fetchUrl, dirPath)
	} catch (error) {
		errorHandler(error, ctx)
	}
})

router.get('/:type/:id', async (ctx: any) => {
	try {
		const { type, id } = ctx['params']

		const game = await getGameById(id)

		if (game === undefined) throw new Error(`Game with id/appid: ${id} does not exist`)

		// Will throw error if type not found, retuns the proper steam fetch url
		const fetchUrl: string = urls[type](game['appid'])

		const { dirPath, filePath } = getFilePaths(game['name'], game['_id'], type)

		await sendImageResponse(ctx, filePath, fetchUrl, dirPath)
	} catch (error) {
		errorHandler(error, ctx)
	}
})

module.exports = {
	routes: router.routes(),
	allowedMethods: router.allowedMethods(),
}
