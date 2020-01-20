//GraphQL
import graphqlHTTP from 'koa-graphql'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'

const PATH = '../resolvers/'

const resolvers = [require(`${PATH}GameResolver`), require(`${PATH}DeveloperResolver`), require(`${PATH}PublisherResolver`), require(`${PATH}GenreResolver`)]

export function getGraphQLHTTP(): Promise<any> {
	return new Promise(async (resolve, reject) => {
		try {
			const schema = await buildSchema({
				resolvers,
			})

			resolve(graphqlHTTP({ schema, graphiql: true }))
		} catch (error) {
			reject(error)
		}
	})
}
