import { writable } from 'svelte/store'

import createRouter from 'store/modules/router.js'

export const router = createRouter()

export const sortAchievementAmount = writable(0)
export const sortDifficulty = writable(0)