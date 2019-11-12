import createRouter from 'store/modules/router.js'
import createSort from 'store/modules/sorting.js'
import createFilter from 'store/modules/filtering.js'

export const router = createRouter()
export const sorting = createSort()
export const filtering = createFilter()
