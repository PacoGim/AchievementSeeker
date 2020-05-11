const table: string[] = ['qY', 'gm', 'Al', 'bN', 'Cf', 'uT', 'Wx', 'eZ', 'ji', 'dh']

export function encrypt(id: string) {
	return (
		id
			.split('')
			.map((num) => table[Number(num)])
			.join('') + Math.random().toString(36).substring(4)
	)
}

export function decrypt(id: string): string {
	let splitString = id.match(/.{1,2}/g)

	if (splitString) {
		return splitString
			.map((chunk: string) => {
				if (table.indexOf(chunk) !== -1) {
					return table.indexOf(chunk)
				}
			})
			.join('')
	} else {
		return ''
	}
}
