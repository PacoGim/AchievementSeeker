import { ParameterizedContext } from 'koa'
import { IStatus } from '../entities/StatusEntity'

export const statuses: IStatus = {
	200: 200,
	204: 204,
}

export default class HeaderService {
	static ctx: ParameterizedContext

	static setCtx(ctx: ParameterizedContext) {
		this.ctx = ctx
		return this
	}

	static setBody(body: any) {
		this.isCtxDefined()
		this.ctx['body'] = body
		return this
	}

	static setStatus(statusCode: number) {
		this.isCtxDefined()
		this.ctx['status'] = statuses[statusCode]
		return this
	}

	static setHeader(headerName: string, headerValue: string) {
		this.isCtxDefined()
		this.ctx.set(headerName, headerValue)
		return this
	}

	private static isCtxDefined() {
		if (this.ctx === undefined) {
			throw new Error('The Koa Context Object has not been defined. Define ctx first before calling other methods')
		}
	}
}
