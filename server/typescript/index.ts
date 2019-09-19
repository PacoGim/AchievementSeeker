// KoaJS Imports
import Koa from 'koa'
const server = new Koa()
import http from 'http'

require('dotenv').config()

const passport = require('koa-passport')

const SteamStrategy = require('passport-steam').Strategy

import { DBConnector } from './db/index'
// import collections from './db/collections'

new DBConnector('AchievementSeeker')
	.connect()
	.on('err', (err: string) => console.log(err))
	.on('connected', async () => {
		console.log('Connected')
	})

passport.use(
	new SteamStrategy({
		returnURL: `http://localhost:443/steam/return`,
		realm: `http://localhost:443/`,
		apiKey: process.env.STEAM_API_KEY,
	})
)

server.use(passport.initialize())

// const http2 = require('http2')
// const fs = require('fs')
// const path = require('path')
// const cors = require('koa2-cors')

const port: number = Number(process.env.PORT) || 443

import { getCacheUrl } from './url-cache'

// app.use(cors())

server.use(async (ctx, next) => {
	const startDate: number = Number(new Date())
	ctx.set('Strict-Transport-Security', 'max-age=3600')
	ctx.set('X-Content-Type-Options', 'nosniff')
	ctx.set('X-Frame-Options', 'deny')
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
	ctx.set('X-XSS-Protection', '1; mode=block')
	await next()

	console.log(`${ctx['req']['url']} served in ${Number(new Date()) - startDate} ms`)
})

server.use(async (ctx, next) => {
	const reqUrl = ctx['req']['url'] || ''

	if (getCacheUrl(reqUrl) !== undefined) {
		ctx.status = 200
		ctx.body = getCacheUrl(reqUrl)
	} else {
		await next()
	}
})

// Loads routes dynamically
import routesLoader from './routes/index'
routesLoader(server)

process.on('uncaughtException', err => console.log(err))

// http2
// 	.createSecureServer(
// 		{
// 			key: fs.readFileSync(path.join(__dirname, '/keys/cert.key')),
// 			cert: fs.readFileSync(path.join(__dirname, '/keys/cert.crt')),
// 			allowHTTP1: true,
// 		},
// 		app.callback()
// 	)
// 	.listen(port, err => {
// 		if (err) throw new Error(err)
// 		else {
// 			console.log(`🚀 Server running on port ${port}`)
// 		}
// 	})

// http
// 	.createServer(server.callback())
// 	.listen(port)
// 	.on('connection', () => {
// 		console.log(`🚀 Server running on port ${port}`)
// 	})
// 	.on('error', (err: string) => {
// 		if (err) throw new Error(err)
// 	})

server.listen(port, () => {
	console.log(`🚀 Server running on port ${port}`)
})
