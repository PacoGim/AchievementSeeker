// import fs from 'fs'
const fs = require('fs')
const path = require('path')
// import path from 'path'

module.exports = {
	debugWrite(message) {
		fs.appendFileSync('.', `${getCurrentTime()} - ${message}\n`)

		function getCurrentTime() {
			//@ts-ignore
			return new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hourCycle: 'h24' })
		}
	}
}
