import fs from 'fs'

export function debugWrite(level: 'info' | 'error', message: string) {
	let date = new Date().toLocaleString('en-GB', {
		timeZone: 'UTC',
		hour12: false,
		day: '2-digit',
		weekday: 'short',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short'
	})

	fs.appendFileSync(`./logs/${level}/debug.log`, `${date} ${level.toUpperCase()} - ${message}\n`)
}
