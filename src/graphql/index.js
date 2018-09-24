import {makeExecutableSchema,} from 'graphql-tools'
import resolvers from './resolvers'
import typeDefs from './schema/root.graphql'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  'logger': {
    /* eslint-disable-next-line no-console */
    'log': console.error,
  },
})
