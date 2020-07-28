import { ParameterizedContext } from 'koa'
import send from 'koa-send'
import fs from 'fs-extra'
import path from 'path'
import fetch from 'node-fetch'
import sharp from 'sharp'
import { getSafeString } from './functions'
import { ObjectId } from 'mongodb'

/**
 * @description Sends to the client
 *
 * @param {*} ctx
 * @param {string} filePath
 * @param {string} fetchUrl
 * @param {string} dirPath
 */
export async function sendImageResponse(ctx: any, filePath: string, fetchUrl: string, dirPath: string) {
	if (fs.existsSync(filePath)) {
		ctx.set('Content-Type', 'image/webp')
		ctx.set('Cache-Control', 'max-age=604800')
		await send(ctx, filePath, { root: '/' })
	} else {
		ctx.set('Content-Type', 'text/plain')
		ctx['body'] = fetchUrl

		console.log(filePath)

		fetchAndSaveImage(fetchUrl, dirPath, filePath)
	}
}

interface IFilePaths {
	dirPath: string
	filePath: string
}

/**
 *	@description Gives back well formatted directory and file paths based on the game name and id.
 *
 * @param {string} gameName
 * @param {string} gameId
 * @param {string} fileName
 * @param {string} [subDir='']
 * @returns {IFilePaths}
 */
export function getFilePaths(gameName: string, gameId: string, fileName: string, subDir: string = ''): IFilePaths {
	const folderName: string = `${getSafeString(gameName, 20)}-${gameId}`
	const dirPath: string = path.join(path.resolve(), '/server/public/images', folderName, subDir)
	const filePath: string = path.join(dirPath, `${fileName}.webp`)

	const paths: IFilePaths = {
		dirPath,
		filePath
	}

	return paths
}

export function fetchAndSaveImage(fetchUrl: string, dirPath: string, filePath: string) {
	fs.mkdirpSync(dirPath)

	fetch(fetchUrl)
		.then((res) => {
			if (res['status'] === 404) throw new Error('Appid has not the requested image.')
			else return res.arrayBuffer()
		})
		.then((arrayBuffer) => {
			sharp(Buffer.from(arrayBuffer))
				.webp()
				.toFile(filePath, (err, info) => {
					if (err?.['message'] === 'Input buffer contains unsupported image format') {
						console.log('Given fetch image url does not give back a valid image.')
					}else	{
						console.log('lel')
					}
				})
		})
		.catch((err) => {
			if (err?.['message'] === 'Appid has not the requested image.'){
				console.log('Image not available.')
			}else{
				console.log(err)
			}
		})
}
