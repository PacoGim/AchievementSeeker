// KoaJS Imports
const Koa = require('koa')
const server = new Koa()
const http = require('http')

require('dotenv').config()


const passport = require('koa-passport')

const SteamStrategy = require('passport-steam').Strategy

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

const DB = require('./db')
new DB('AchievementSeeker', 'Games').on('err', err => console.log(err))

const port = process.env.PORT || 443

const { getCache, setCache } = require('./cache')

// app.use(cors())

server.use(async (ctx, next) => {
	const startDate = new Date()
	ctx.set('Strict-Transport-Security', 'max-age=3600')
	ctx.set('X-Content-Type-Options', 'nosniff')
	ctx.set('X-Frame-Options', 'deny')
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
	ctx.set('X-XSS-Protection', '1; mode=block')
	await next()

	console.log(`${ctx['req']['url']} served in ${new Date() - startDate} ms`)
})

server.use(async (ctx, next) => {
	const reqUrl = ctx['req']['url']

	if (getCache()[reqUrl]) {
		ctx.status = 200
		ctx.body = getCache()[reqUrl]
	} else {
		await next()
	}
})

// Loads routes dynamically
require('./routes/index')(server)

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

http.createServer(server.callback()).listen(port, err => {
	if (err) throw new Error(err)
	else {
		console.log(`🚀 Server running on port ${port}`)
	}
})
