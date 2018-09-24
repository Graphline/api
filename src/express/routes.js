import {graphqlExpress,} from 'apollo-server-express'
import bodyParser from 'body-parser'
import playground from 'graphql-playground-middleware-express'

import usercsssRenderer from './usercss-renderer'
import backend from './backend'

export default async ({app, config,}) => {
  app.use('/theme/:id.user.css', usercsssRenderer)

  app.post('/', bodyParser.json({
    'limit': 120000,
  }), graphqlExpress(backend))

  app.get('/', playground({
    'endpoint': '/',
  }))
}
