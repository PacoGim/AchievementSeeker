import fs from 'fs'

export function debugWrite(message: string) {
	fs.appendFileSync('debug.log', `${getCurrentTime()} - ${message}\n`)

	function getCurrentTime() {
		//@ts-ignore
		return new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hourCycle: 'h24' })
	}
}
