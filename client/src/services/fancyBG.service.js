export function setFancyBG({ color1 = '#333', color2 = '#444', transform1 = '0', transform2 = '0', opacity = 1, height1 = '50vh', width1 = '100vw', height2 = '50vh', width2 = '100vw' }) {
	document.documentElement.style.setProperty('--fancy-bg-opacity', opacity)
	setTimeout(() => {
		document.documentElement.style.setProperty('--fancy-bg-color-1', color1)
		document.documentElement.style.setProperty('--fancy-bg-color-2', color2)
		document.documentElement.style.setProperty('--fancy-bg-transform-1', transform1)
		document.documentElement.style.setProperty('--fancy-bg-transform-2', transform2)
		document.documentElement.style.setProperty('--fancy-bg-height-1', height1)
		document.documentElement.style.setProperty('--fancy-bg-height-2', height2)
		document.documentElement.style.setProperty('--fancy-bg-width-1', width1)
		document.documentElement.style.setProperty('--fancy-bg-width-2', width2)
	}, 100)
}
