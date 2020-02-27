import { writable } from 'svelte/store'

export let searchInputValue = writable('')

export let dynamicPageName = writable('Loading...')
