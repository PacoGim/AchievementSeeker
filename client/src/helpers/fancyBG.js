const values = {
	home: {
		fancyBGColor: {
			1: '#cb2d3e',
			2: '#ef473a',
		},
		transform: {
			1: 'skewY(2deg) translateY(-60px)',
			2: 'skewY(-2deg) translateY(-60px)',
		},
	},
	'game list': {
		fancyBGColor: {
			1: '#6fb1fc',
			2: '#4364f7',
		},
		transform: {
			1: 'skewY(-2.5deg) translateY(-45px)',
			2: 'skewY(1deg)',
		},
	},
	'search game': {
		fancyBGColor: {
			1: '#41295a',
			2: '#2f0743',
		},
		transform: {
			1: 'skewY(-5deg) translateY(-70px)',
			2: 'skewY(20deg) translateY(-100px)',
		},
	},
	game: {
		fancyBGColor: {
			1: '#3a6186',
			2: '#89253e',
		},
		transform: {
			1: 'skewY(4deg) translateY(-70px)',
			2: 'skewY(-2deg) translateY(-50px)',
		},
	},
}

function setFancyBG(name) {
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
	document.documentElement.style.setProperty('--transform-1', 'skewY(-5deg) translateY(-100px)')
	document.documentElement.style.setProperty('--transform-2', 'skewY(20deg) translateY(-100px)')
}

export { setFancyBG, setGameFancyBG }
