import jwt from 'jsonwebtoken'

export function getToken(payload: Object): Promise<string | undefined> {
	return new Promise((resolve, reject) => {
		let secret = process.env.JWT_SECRET
		if (secret) {
			jwt.sign(payload, secret, (error, encoded) => {
				resolve(encoded)
			})
		}
	})
}

export function getTokenData(token: string): Promise<string | object> {
	return new Promise((resolve, reject) => {
		let secret = process.env.JWT_SECRET
		if (secret) {
			try {
				let decoded = jwt.verify(token, secret)
				if (decoded) {
					resolve(decoded)
				}
			} catch (error) {
				reject(error['message'])
			}
		}
	})
}

export function verifyToken(token: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		let secret = process.env.JWT_SECRET
		if (secret) {
			try {
				let isValid = jwt.verify(token, secret)
				if (isValid) {
					resolve(true)
				} else {
					reject(false)
				}
			} catch (error) {
				reject(false)
			}
		}
	})
}
