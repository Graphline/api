import {makeExecutableSchema,} from 'graphql-tools'
import resolvers from './resolvers'
import typeDefs from './schema/root.graphql'
import {log,} from 'lib/logger'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  'logger': {
    'log': log.warn,
  },
})
