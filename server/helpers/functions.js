function genNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function hashCode(input) {
	if (!input) input = ''
	var hash = 0,
		i,
		chr
	if (input.length === 0) return hash
	for (i = 0; i < input.length; i++) {
		chr = input.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	// return hash

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

module.exports = { genNum, hashCode }
