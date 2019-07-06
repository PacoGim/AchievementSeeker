const fs = require('fs')
const path = require('path')

module.exports = function(app) {
	return new Promise((resolve, reject) => {
		try {
			let routes = []

			fs.readdirSync(path.join(__dirname)).forEach(fileName => {
				if (fileName !== 'index.js') {
					let route = require('./' + fileName)

					if (route && route['routes']) {
						app.use(route['routes'])
						route && route['allowedMethods'] ? app.use(route['allowedMethods']) : console.log(`Route ${fileName} has no allowedMethods object defined`)
						routes.push(fileName)
					} else {
						console.log(`Route ${fileName} has no routes object defined`)
					}
				}
			})

			if (routes.length > 0) {
				console.log(`Routes ${routes} Loaded`)
			} else {
				console.log('No routes loaded')
			}
			resolve(true)
		} catch (error) {
			reject(error)
		}
	})
}
