import { writable } from 'svelte/store'

export const currentRoute = writable('Route')

export const isDay = writable(true)
