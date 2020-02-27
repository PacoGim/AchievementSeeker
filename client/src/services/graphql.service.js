/**
 *
 *
 * @param {string} queryType
 * @param {string[]} fields
 * @param {object} sort
 * @param {object} filter
 * @returns string
 */
export function buildQuery(queryType, fields, sort, filter, skip, limit) {
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

	if (sort === undefined && filter === undefined && skip === undefined) {
		return `
			{
				${queryType}
			{
					${joinedFields}
			}
		}
		`
	} else {
		return `
    {
      ${queryType}
      (
        ${sort !== undefined ? `sortBy:${parsedSort}` : ''}
        ${filter !== undefined ? `filterBy:${parsedFilter}` : ''}
				skip:${skip === undefined ? 0 : skip}
				limit:${limit === undefined || limit > 20 ? 20 : limit}
			)
    {
        ${joinedFields}
    }
  }
	`
	}
}

export default {
	buildQuery,
}
