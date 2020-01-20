import Koa, { ParameterizedContext, Next } from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import passport from 'koa-passport'

import { Strategy as SteamStrategy } from 'passport-steam'

import path from 'path'

// Database
import { connectToDB } from './database/index'

import { loadRoutes } from './helpers/functions'
import { getGraphQLHTTP } from './helpers/graphql'
import { getCacheUrl } from './helpers/url-cache'
import HeaderService from './helpers/header'

// DotEnv Initialization
require('dotenv').config()

// Main Function
;(async function main() {
	let app: Koa = new Koa()
	const port: number = Number(process.env.PORT) || 3000
	const routesToLoad: string[] = ['GameRoute', 'ImageRoute']
	const uri: string = `mongodb://readOnlyUser:readOnlyUserPWD@localhost:27017`

	// Passport Config and Init
	app.use(
		passport
			.use(
				new SteamStrategy({
					returnURL: `http://localhost:${port}/steam/return`,
					realm: `http://localhost:${port}/`,
					apiKey: process.env.STEAM_API_KEY,
				})
			)
			.initialize()
	)

	// MongoDB
	connectToDB('AchievementSeeker', uri)
		.then(message => console.log(message))
		.catch(err => console.error('Error from connectToDB: ', err))

	// Serve static public folder
	app.use(serve(path.join(__dirname, '../public')))

	// Before loading routes
	app.use((ctx: ParameterizedContext, next: Next) => preRouting(ctx, next))

	// Routes Loader
	loadRoutes(app, '/server/dist/routes', routesToLoad)

	// GraphQL Mount
	app.use(mount('/api', await getGraphQLHTTP()))

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
		console.log(`${decodeURI(url)} served${ctx['cached'] ? ' from cache' : ''} in ${Number(new Date()) - startDate} ms`)
	}
}

function setHeaders(ctx: ParameterizedContext) {
	HeaderService.setCtx(ctx)
		.setHeader('Strict-Transport-Security', 'max-age=3600')
		.setHeader('X-Content-Type-Options', 'nosniff')
		.setHeader('X-Frame-Options', 'deny')
		.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
		.setHeader('X-XSS-Protection', '1; mode=block')
}

function startServer(app: Koa, port: number): void {
	app
		.listen(port)
		.on('error', err => console.error(err))
		.on('listening', () => {
			console.log(`🚀 Server running on port ${port}`)
		})
}
