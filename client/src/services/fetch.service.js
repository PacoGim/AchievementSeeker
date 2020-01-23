const protocol = 'http://'
const domain = 'localhost'
const port = '3000'
const fullUrl = `${protocol}${domain}:${port}`

export function get(url) {
	return new Promise((resolve, reject) => {
		try {
			fetch(`${fullUrl}${url}`).then(async response => {
				let status = response['status']
				let responseDetails = JSON.parse(response['headers'].get('Response-Details'))
				let contentType = response['headers'].get('Content-Type')

				if (status === 204) {
					resolve({ status, details: responseDetails })
				} else if (status === 200) {
					if (contentType.includes('application/json')) {
						let data = await response.json()
						resolve({ status, ...data })
					}
				}
			})
		} catch (error) {
			reject(error)
		}
	})
}

export default {
	get,
}
