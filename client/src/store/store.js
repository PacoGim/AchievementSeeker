// import { writable } from 'svelte/store'

import createCurrentRoute from 'store/modules/currentRoute.js'
import createRouter from 'store/modules/router.js'

export const currentRoute = createCurrentRoute()
export const router = createRouter()
