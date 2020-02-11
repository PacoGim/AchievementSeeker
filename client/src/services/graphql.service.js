/**
 *
 *
 * @param {string} queryType
 * @param {string[]} fields
 * @param {object} sort
 * @param {object} filter
 * @returns string
 */
export function buildQuery(queryType, fields, sort, filter) {
	let joinedFields = fields.join(' ')

	for (let key in sort) {
		if (sort[key] === 0) {
			delete sort[key]
		}
	}

	for (let key in filter) {
		if (filter[key] === 0) {
			delete filter[key]
		}
	}
	let parsedFilter = filter !== undefined ? JSON.stringify(filter).replace(/"/g, '') : undefined

	let parsedSort = sort !== undefined ? JSON.stringify(sort).replace(/"/g, '') : undefined

	return `
    {
      ${queryType}
      ${sort !== undefined || filter !== undefined ? '(' : ''}
        ${sort !== undefined ? `sortBy:${parsedSort}` : ''}
        ${filter !== undefined ? `filterBy:${parsedFilter}` : ''}
      ${sort !== undefined || filter !== undefined ? ')' : ''}
    {
        ${joinedFields}
    }
  }
  `
}

export default {
	buildQuery,
}
