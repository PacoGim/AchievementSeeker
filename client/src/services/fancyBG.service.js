export function setFancyBG(color1 = '#333', color2 = '#444', transform1 = '0', transform2 = '0', opacity = 1) {
	document.documentElement.style.setProperty('--fancy-bg-opacity', opacity)
	setTimeout(() => {
		document.documentElement.style.setProperty('--fancy-bg-color-1', `${color1}`)
		document.documentElement.style.setProperty('--fancy-bg-color-2', `${color2}`)
		document.documentElement.style.setProperty('--transform-1', transform1)
		document.documentElement.style.setProperty('--transform-2', transform2)
	}, 100)
}
