// KoaJS Imports
const Koa = require('koa')
const app = new Koa()
const http2 = require('http2')
const fs = require('fs')
const cors = require('@koa/cors')
const path = require('path')

const DB = require('./db')
new DB('AchievementSeeker', 'Games').on('err', err => console.log(err))

const port = process.env.PORT || 443

app.use(cors())

// Loads routes dynamically
require('./routes/index')(app)

// app.use(async ctx => {
// await require('./routes/index')(app)
// ctx.body = 'Hello World'
// app = await loadRoutes(app)
// })

process.on('uncaughtException', err => console.log(err))

http2
	.createSecureServer(
		{
			key: fs.readFileSync(path.join(__dirname, '/keys/localhost-privkey.pem')),
			cert: fs.readFileSync(path.join(__dirname, '/keys/localhost-cert.pem')),
			allowHTTP1: true,
		},
		app.callback()
	)
	.listen(port, err => {
		if (err) throw new Error(err)
		else {
			console.log(`🚀 Server running on port ${port}`)
		}
	})
