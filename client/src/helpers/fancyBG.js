const values = {
	register: {
		fancyBGColor: {
			1: '#C81949',
			2: '#1A1408',
		},
		transform: {
			1: 'skewY(15deg) translateY(-10px)',
			2: 'skewY(-15deg) translateY(-60px)',
		},
	},
}

function setFancyBG(name) {
	console.log(name)
	name = name.toLowerCase()

	if (values[name]) {
		document.documentElement.style.setProperty('--fancy-bg-opacity', 1)
		document.documentElement.style.setProperty('--fancy-bg-color-1', values[name]['fancyBGColor'][1])
		document.documentElement.style.setProperty('--fancy-bg-color-2', values[name]['fancyBGColor'][2])
		document.documentElement.style.setProperty('--transform-1', values[name]['transform'][1])
		document.documentElement.style.setProperty('--transform-2', values[name]['transform'][2])
	}
}

function setGameFancyBG() {
	document.documentElement.style.setProperty('--fancy-bg-opacity', '.5')
	document.documentElement.style.setProperty('--fancy-bg-color-1', '#000')
	document.documentElement.style.setProperty('--fancy-bg-color-2', '#000')
	document.documentElement.style.setProperty('--transform-1', 'skewY(-5deg) translateY(-0px)')
	document.documentElement.style.setProperty('--transform-2', 'skewY(5deg) translateY(-0px)')
}

// export { setFancyBG, setGameFancyBG }
