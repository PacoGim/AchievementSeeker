export function aliasFromName(name: string): string[] {
	let alias: string = name

	alias = alias.replace(':', ' ')
	alias = alias.replace('-', ' ')
	alias = alias.replace('/', ' ')
	alias = alias.replace(')', ' ')
	alias = alias.replace('(', ' ')

	alias = alias
		.split(' ')
		.map((x) => {
			if (RegExp('^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$').test(x)) return x
			else return x.substring(0, 1)
		})
		.join('')
		.toLowerCase()

	return [alias]
}