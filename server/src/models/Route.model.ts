import {Middleware} from 'koa'

export interface IRoute {
	routes: Middleware
}