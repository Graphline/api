import {ApolloServer,} from 'apollo-server-express'
import {log,} from 'lib/logger'

import typeDefs from '~/graphql/schema/root.graphql'
import resolvers from '~/graphql/resolvers'
import context from '~/graphql/context'

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  'subscriptions': {
    'path': '/',
  },
})

export default async ({app, server,}) => {
  log.debug('applying apollo middleware')
  apollo.applyMiddleware({
    app,
    'path': '/',
  })

  log.debug('installing subscription handlers')
  apollo.installSubscriptionHandlers(server)
}
