export function isWebpSupported() {
	return new Promise(async resolve => {
		if (window.isWebpSupported === undefined) {
			// console.log('Checking WebP support...')
			if (!self.createImageBitmap) return false
			const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
			const blob = await fetch(webpData).then(r => r.blob())
			let isWebpSupported = await createImageBitmap(blob).then(
				() => true,
				() => false
			)

			// window.isWebpSupported = false
			window.isWebpSupported = isWebpSupported

			// isWebpSupported ? console.log('This browser supports Webp.') : console.log("This browser doesn't support Webp :(")

			// resolve(false)
		}

		resolve(window.isWebpSupported)
	})
}

export function areObjectsEqual(a, b) {
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(a)
	var bProps = Object.getOwnPropertyNames(b)

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length != bProps.length) {
		return false
	}

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i]

		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true
}

export function parseDate(date) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

	date = new Date(date)
	let day = date.getUTCDate()
	let month = months[date.getUTCMonth()]
	let year = date.getUTCFullYear()
	let indicator = ['st', 'nd', 'rd', 'th'][day > 3 ? 3 : day - 1]

	return `${day}${indicator} ${month}, ${year}`
}

export function isJsonEmpty(inJson) {
	let keyFound = false

	for (let key in inJson) {
		keyFound = true
		break
	}

	if (keyFound === true) {
		return false
	} else {
		return true
	}
}

export function genNum(min, max) {
	return Number(Math.floor(Math.random() * (max - min + 1) + min))
}

export function fetchImageBase64(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(res => res.text())
			.then(imageBase64 => resolve(imageBase64))
	})
}

export function fetchImageArrayBuffer(url) {
	return new Promise((resolve, reject) => {
		fetch(url).then(async res => {
			if (res['headers'].get('Content-Type') === 'text/plain') {
				resolve(await res.text())
			} else {
				res.arrayBuffer().then(imageBuffer => {
					const arrayBufferView = new Uint8Array(imageBuffer)
					const blob = new Blob([arrayBufferView], { type: 'image/webp' })
					const urlCreator = window.URL || window.webkitURL
					const imageUrl = urlCreator.createObjectURL(blob)
					resolve(imageUrl)
				})
			}
		})
	})
}

export function fetchImageBuffer(url) {
	return new Promise(async (resolve, reject) => {
		const imageBuffer = await fetch(url)
			.then(res => res.arrayBuffer())
			.catch(err => {
				console.log('Error', err)
			})
		resolve(imageBuffer)
	})
}

export function imageArrayBufferToUrl(buffer) {
	return new Promise((resolve, reject) => {
		const arrayBufferView = new Uint8Array(buffer)
		const blob = new Blob([arrayBufferView])
		const urlCreator = window.URL || window.webkitURL
		const imageUrl = urlCreator.createObjectURL(blob)
		resolve(imageUrl)
	})
}

export function genID(length = undefined) {
	let options = {
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

	for (let char of value) {
		id += options[char]()
	}

	id = id
		.split('')
		.reverse()
		.join('')
		.toUpperCase()

	if (length !== undefined) {
		return id.substring(0, length)
	} else {
		return id
	}
}

export function smoothScrollTo(query) {
	if (window.smoothScrollInterval) clearInterval(window.smoothScrollInterval)

	let element = document.querySelector(query)
	console.log(query)
	let globalScroll = window.scrollY

	// Distance between current visible top left corner of document and element
	let elY = element.getBoundingClientRect().y

	// Lowest point where the speed has to start slowing down
	let elYLow = Math.abs(Math.trunc((elY / 3) * 1))

	// Midpoint where the speed has to be constant
	let elYMid = Math.abs(Math.trunc((elY / 3) * 2))

	// Distance between the current document scroll position and where the next element is
	// If we have a global scroll of 0,0 we need to add the current scroll + the next element position
	let distance = globalScroll + elY

	// Tells if we need to go up or down. 0 is negative and 1 is positive
	let sign = elY <= 0 ? 0 : 1

	// Base starting speed
	let scrollSpeed = 0

	window.smoothScrollInterval = setInterval(() => {
		let currentEly = Math.abs(element.getBoundingClientRect().y)

		if (currentEly > elYMid) {
			scrollSpeed += 1
		} else if (currentEly <= elYLow) {
			if (scrollSpeed > 5) {
				scrollSpeed -= 1
			}
		}

		if (sign === 1) {
			window.scrollTo(0, (globalScroll += scrollSpeed))

			if (globalScroll > distance) {
				window.scrollTo(0, distance + 1)
				clearInterval(window.smoothScrollInterval)
			}
		} else if (sign === 0) {
			window.scrollTo(0, (globalScroll -= scrollSpeed))

			if (globalScroll < distance) {
				window.scrollTo(0, distance + 1)
				clearInterval(window.smoothScrollInterval)
			}
		}
	}, 10)
}
