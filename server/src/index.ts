import http2 from 'http2'
import fs from 'fs'
import path from 'path'

// KoaJS Imports
import Koa from 'koa'
const mount = require('koa-mount')
const serve = require('koa-static')
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

function connectToDB() {
	new DBConnector()
		.connect()
		.on('err', (err: Error) => {
			if (err['name'] === 'MongoTimeoutError') {
				console.log('Warning! MongoDB is unreachable. Trying to connect again in 10 seconds...')
				setTimeout(() => {
					connectToDB()
				}, 10000);
			}
		})
		.on('connected', async () => {
			console.log('Server connected to MongoDB!')
		})
}

async function main() {
	connectToDB()
	const app = new Koa()
	const port: number = Number(process.env.PORT) || 4000


	const schema = await buildSchema({
		resolvers: [GameResolver, DeveloperResolver, PublisherResolver, GenreResolver],
	})

	passport.use(
		new SteamStrategy({
			returnURL: `http://localhost:443/steam/return`,
			realm: `http://localhost:443/`,
			apiKey: process.env.STEAM_API_KEY,
		})
	)

	app.use(passport.initialize())

	// Serve static public folder
	app.use(serve(path.join(__dirname, '../public')))

	app.use(async (ctx, next) => {
		const startDate: number = Number(new Date())
		ctx.set('Strict-Transport-Security', 'max-age=3600')
		ctx.set('X-Content-Type-Options', 'nosniff')
		ctx.set('X-Frame-Options', 'deny')
		ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
		ctx.set('X-XSS-Protection', '1; mode=block')
		await next()
		// if (ctx['req']['url']) console.log(`${decodeURI(ctx['req']['url'])} served in ${Number(new Date()) - startDate} ms`)
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

	app.use(mount('/graphql', graphqlHTTP({ schema, graphiql: true })))

	process.on('uncaughtException', err => console.log(err))

	app
		.listen(port)
		.on('error', err => console.error(err))
		.on('listening', () => {
			console.log(`🚀 Server running on port ${port}`)
		})

	// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

	// openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out example.crt -keyout example.key

	// http2
	// 	.createSecureServer(
	// 		{
	// 			key: fs.readFileSync(path.join(__dirname, '../keys/example.key')),
	// 			cert: fs.readFileSync(path.join(__dirname, '../keys/example.crt')),
	// 			allowHTTP1: true,
	// 			rejectUnauthorized:false
	// 		},
	// 		app.callback()
	// 	)
	// 	.listen(8443)
	// 	.on('error', err => console.error(err))
	// 	.on('listening', () => {
	// 		console.log(`🚀 Server running on port ${port}`)
	// 	})
}

main()
