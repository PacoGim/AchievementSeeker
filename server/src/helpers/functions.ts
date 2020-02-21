import { IRoute } from '../entities/RouteEntity'
import path from 'path'
import { ParameterizedContext } from 'koa'
import Koa from 'koa'

export function genNum(min: number, max: number): number {
	return Number(Math.floor(Math.random() * (max - min + 1) + min))
}

export function hashCode(input: string): string {
	if (!input) input = ''
	let hash = 0
	let i
	let chr

	if (input.length === 0) return ''
	for (i = 0; i < input.length; i++) {
		chr = input.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}

	let code = ''

	for (let char of String(hash)) {
		switch (char) {
			case '-':
				code += '0'
				break
			case '0':
				code += 'X'
				break
			case '1':
				code += '7'
				break
			case '2':
				code += 'S'
				break
			case '3':
				code += '5'
				break
			case '4':
				code += 'L'
				break
			case '5':
				code += '2'
				break
			case '6':
				code += 'H'
				break
			case '7':
				code += '1'
				break
			case '8':
				code += 'P'
				break
			case '9':
				code += '8'
				break
		}
	}

	return code
}

export function genID() {
	let options: { [index: string]: Function } = {
		'0': () => {
			return ['b', 'n', 'z'][genNum(0, 2)]
		},
		'1': () => {
			return ['c', 'p', '0'][genNum(0, 2)]
		},
		'2': () => {
			return ['d', 'q', '1'][genNum(0, 2)]
		},
		'3': () => {
			return ['f', 'r', '3'][genNum(0, 2)]
		},
		'4': () => {
			return ['g', 's', '4'][genNum(0, 2)]
		},
		'5': () => {
			return ['h', 't', '5'][genNum(0, 2)]
		},
		'6': () => {
			return ['j', 'v', '6'][genNum(0, 2)]
		},
		'7': () => {
			return ['k', 'w', '7'][genNum(0, 2)]
		},
		'8': () => {
			return ['l', 'x', '8'][genNum(0, 2)]
		},
		'9': () => {
			return ['m', 'y', '9'][genNum(0, 2)]
		},
	}

	let value = new Date().getTime().toString(10)
	let id = ''

	// for (let char of value) {
	// 	genNum(0, 1) === 0 ? (id += options[char]().toUpperCase()) : (id += options[char]())
	// }

	for (let char of value) {
		id += options[char]()
	}

	return id
		.split('')
		.reverse()
		.join('')
		.toUpperCase()
}

export function getDifficulty(easy: number, medium: number, hard: number) {
	let sum = 100 / (easy + medium + hard)

	medium = medium * sum
	easy = easy * sum + medium / 2
	hard = hard * sum + medium / 2

	const average = Math.round((100 / (easy + hard)) * hard)

	if (average > 0 && average <= 10) return { value: average, text: `Piece of Cake (${average})` }
	if (average > 10 && average <= 20) return { value: average, text: `Soft (${average})` }
	if (average > 20 && average <= 30) return { value: average, text: `Very Easy (${average})` }
	if (average > 30 && average <= 40) return { value: average, text: `Easy (${average})` }
	if (average > 40 && average <= 50) return { value: average, text: `Mildly Easy (${average})` }
	if (average > 50 && average <= 60) return { value: average, text: `Normal (${average})` }
	if (average > 60 && average <= 70) return { value: average, text: `Mildy Hard (${average})` }
	if (average > 70 && average <= 80) return { value: average, text: `Hard (${average})` }
	if (average > 80 && average <= 90) return { value: average, text: `Very Hard (${average})` }
	if (average > 90 && average <= 100) return { value: average, text: `Insane (${average})` }
}

export function loadRoutes(app: Koa, rootPath: string, routeList: string[]): void {
	routeList.forEach(routeName => {
		let route: IRoute = require(path.join(path.resolve(), rootPath, routeName + '.js'))
		app.use(route.routes)
		console.log(`${routeName} Loaded`)
	})
}

export function getSafeString(name: string, limit: number) {
	return name.replace(/[^a-zA-Z0-9]+/g, '').substring(0, limit)
}

export function errorHandler(error: Error, ctx: ParameterizedContext | any) {
	let errorMessage: string = ''

	if (error.message === 'urls[type] is not a function') {
		errorMessage = 'Image type not valid'
	} else if (error.message === 'Game does not exist') {
		errorMessage = 'Game id or appid not found'
	} else {
		errorMessage = error.message
	}
	ctx.status = 204
	ctx.set('Response-Detail', errorMessage)
}
