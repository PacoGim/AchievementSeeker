//GraphQL
import graphqlHTTP from 'koa-graphql'
import { buildSchema } from 'type-graphql'
import 'reflect-metadata'

const PATH = '../graphql/resolvers/'

const resolvers = [require(`${PATH}Game.resolver`), require(`${PATH}Developer.resolver`), require(`${PATH}Publisher.resolver`), require(`${PATH}Genre.resolver`)]

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
