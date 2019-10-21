import http2 from 'http2'
import fs from 'fs'
import path from 'path'

// KoaJS Imports
import Koa from 'koa'
const mount = require('koa-mount')
const passport = require('koa-passport')
const SteamStrategy = require('passport-steam').Strategy

import routesLoader from './routes/index'

require('dotenv').config()

//GraphQL
const graphqlHTTP = require('koa-graphql')
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'

import GameResolver from './resolvers/GameResolver'
import DeveloperResolver from './resolvers/DeveloperResolver'
import PublisherResolver from './resolvers/PublisherResolver'
import GenreResolver from './resolvers/GenreResolver'

// Database
import { DBConnector } from './db/index'

//Url Cache
import { getCacheUrl } from './url-cache'

async function startApp() {
	const app = new Koa()

	new DBConnector()
		.connect()
		.on('err', (err: string) => console.log(err))
		.on('connected', async () => {
			console.log('Server connected to MongoDB!')
		})

	const schema = await buildSchema({
		resolvers: [GameResolver, DeveloperResolver, PublisherResolver, GenreResolver],
	})

	app.use(mount('/graphql', graphqlHTTP({ schema, graphiql: true })))

	passport.use(
		new SteamStrategy({
			returnURL: `http://localhost:443/steam/return`,
			realm: `http://localhost:443/`,
			apiKey: process.env.STEAM_API_KEY,
		})
	)

	app.use(passport.initialize())

	const port: number = Number(process.env.PORT) || 8443

	app.use(async (ctx, next) => {
		const startDate: number = Number(new Date())
		ctx.set('Strict-Transport-Security', 'max-age=3600')
		ctx.set('X-Content-Type-Options', 'nosniff')
		ctx.set('X-Frame-Options', 'deny')
		ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
		ctx.set('X-XSS-Protection', '1; mode=block')
		await next()

		console.log(`${ctx['req']['url']} served in ${Number(new Date()) - startDate} ms`)
	})

	app.use(async (ctx, next) => {
		const reqUrl = ctx['req']['url'] || ''

		if (getCacheUrl(reqUrl) !== undefined) {
			ctx.status = 200
			ctx.body = getCacheUrl(reqUrl)
		} else {
			await next()
		}
	})

	// Loads routes dynamically
	routesLoader(app)

	process.on('uncaughtException', err => console.log(err))

	// openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out example.crt -keyout example.key

	http2
		.createSecureServer(
			{
				key: fs.readFileSync(path.join(__dirname, '../keys/example.key')),
				cert: fs.readFileSync(path.join(__dirname, '../keys/example.crt')),
				allowHTTP1: true,
			},
			app.callback()
		)
		.listen(8443)
		.on('error', err => console.error(err))
		.on('listening', () => {
			console.log(`🚀 Server running on port ${port}`)
		})
}

startApp()
