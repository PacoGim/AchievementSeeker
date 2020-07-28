import Koa, { ParameterizedContext, Next } from 'koa'
import mount from 'koa-mount'
import cors from '@koa/cors'
import serve from 'koa-static'
import passport from 'koa-passport'

import fetch from 'node-fetch'

import { Strategy as SteamStrategy } from 'passport-steam'

import path from 'path'

// Database
import { connectToDB } from './database/index'

import { loadRoutes } from './utils/functions'
import { getCacheUrl } from './utils/url-cache'

// DotEnv Initialization
require('dotenv').config()

// Main Function
;(async function main() {
	let app: Koa = new Koa()

	app.use(
		cors({
			allowMethods: 'GET,POST,PATCH',
			origin: (ctx) => {
				const origin = ctx['headers']['origin']

				switch (origin) {
					case 'http://localhost:5000':
						return origin
					case 'http://192.168.1.199:8080':
						return origin
					case 'http://192.168.1.199:3000':
						return origin
				}
			}
		})
	)

	const port: number = Number(process.env.PORT) || 3000
	const routesToLoad: string[] = ['Game', 'Image', 'SteamAuth', 'User', 'Admin']
	const mongoDBUri: string = `mongodb://readOnlyUser:readOnlyUserPWD@localhost:27017`

	// Passport Config and Init
	app.use(
		passport
			.use(
				new SteamStrategy({
					returnURL: `http://192.168.1.199:${port}/steam/return`,
					realm: `http://192.168.1.199:${port}/`,
					apiKey: process.env.STEAM_API_KEY
				})
			)
			.initialize()
	)

	// MongoDB
	connectToDB('AchievementSeeker', mongoDBUri)
		.then((message) => {
			console.log(message)

			// fetch('http://192.168.1.199:3000/steam/return?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=id_res&openid.op_endpoint=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Flogin&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198053722442&openid.identity=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198053722442&openid.return_to=http%3A%2F%2F192.168.1.199%3A3000%2Fsteam%2Freturn&openid.response_nonce=2020-04-13T08%3A46%3A32ZmE6Weh4m3l%2FQ9W6uFyoJu6qsw%2FI%3D&openid.assoc_handle=1234567890&openid.signed=signed%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Cresponse_nonce%2Cassoc_handle&openid.sig=m2AKjESYmiZeyCELtrmqUXhPvy8%3D')
		})
		.catch((err) => console.error('Error from connectToDB: ', err))

	// Runs preRouting before matching other routes
	app.use((ctx: ParameterizedContext, next: Next) => preRouting(ctx, next))

	// Serve static public folder
	app.use(mount('/public', serve(path.join(__dirname, '../public'))))

	// Routes Loader
	loadRoutes(app, '/server/dist/routes', routesToLoad)

	// 404
	app.use((ctx: ParameterizedContext) => {
		ctx['status'] = 404
		ctx['body'] = "Url doesn't match any endpoint"
	})

	// Server Start
	startServer(app, port)
})()

async function preRouting(ctx: ParameterizedContext, next: Next): Promise<void> {
	const startDate: number = Number(new Date())
	const url: string | undefined = ctx['req']['url']

	setHeaders(ctx)

	const cachedData: string | undefined = getCacheUrl(ctx)

	if (cachedData !== undefined) {
		ctx['cached'] = true
		ctx.status = 200
		ctx.body = cachedData
	} else {
		ctx['cached'] = false
		await next()
	}

	if (url) {
		// console.log(`${ctx['req']['method']} Request to ${decodeURI(url)} served${ctx['cached'] ? ' from cache' : ''} in ${Number(new Date()) - startDate} ms`)
	}

	// if (ctx['URL']['pathname'].includes('/public')) {
	// }
}

function setHeaders(ctx: ParameterizedContext) {
	// ctx.set('Cache-Control', 'max-age=604800')
	ctx.set('Access-Control-Expose-Headers', 'Response-Details')
	ctx.set('Strict-Transport-Security', 'max-age=3600')
	ctx.set('X-Content-Type-Options', 'nosniff')
	ctx.set('X-Frame-Options', 'deny')
	ctx.set('X-XSS-Protection', '1; mode=block')
	ctx.set('Access-Control-Allow-Headers', 'Content-Type')
}

function startServer(app: Koa, port: number): void {
	app
		.listen(port)
		.on('error', (err) => console.error(err))
		.on('listening', () => {
			console.log(`🚀 Server running on port ${port}`)
		})
}
