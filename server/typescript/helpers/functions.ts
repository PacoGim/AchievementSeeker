function genNum(min: number, max: number): number {
	return Number(Math.floor(Math.random() * (max - min + 1) + min))
}

function hashCode(input: string): string {
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

function genID() {
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

export { genNum, hashCode, genID }
