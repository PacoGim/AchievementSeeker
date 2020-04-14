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
