// KoaJS Imports
const Koa = require('koa')
const app = new Koa()
const http2 = require('http2')
const http=require('http')
const fs = require('fs')
const path = require('path')
const cors = require('koa2-cors')

const DB = require('./db')
new DB('AchievementSeeker', 'Games').on('err', err => console.log(err))

const port = process.env.PORT || 443

// app.use(cors())

app.use(async (ctx, next) => {
	ctx.set('Strict-Transport-Security', 'max-age=3600')
	ctx.set('X-Content-Type-Options', 'nosniff')
	ctx.set('X-Frame-Options', 'deny')
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
	ctx.set('X-XSS-Protection', '1; mode=block')
	await next()
})

// Loads routes dynamically
require('./routes/index')(app)

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

http
	.createServer(
		app.callback()
	)
	.listen(port, err => {
		if (err) throw new Error(err)
		else {
			console.log(`🚀 Server running on port ${port}`)
		}
	})
