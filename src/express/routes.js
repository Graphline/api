import {ApolloServer,} from 'apollo-server-express'
import {log,} from 'lib/logger'
import cookieParser from 'cookie-parser'
import omitDeep from 'omit-deep-lodash'

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
  'tracing': process.env.NODE_ENV === 'development',
  formatParams (params) {
    const {variables, ...rest} = params

    return {
      ...rest,
      'variables': omitDeep(variables, '__typename'),
    }
  },
})

export default async ({app, server,}) => {
  log.debug('applying cookie-parser middleware')
  app.use((req, res, next) => {
    req.headers.cookie = req.headers.cookie || req.headers['x-cookie']

    return next()
  })
  app.use(cookieParser())

  log.debug('applying apollo middleware')
  apollo.applyMiddleware({
    app,
    'path': '/',
  })

  log.debug('installing subscription handlers')
  apollo.installSubscriptionHandlers(server)
}
