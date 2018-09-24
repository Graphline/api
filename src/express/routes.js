import {graphqlExpress,} from 'apollo-server-express'
import bodyParser from 'body-parser'
import playground from 'graphql-playground-middleware-express'

import backend from './backend'

export default async ({app,}) => {
  app.get('/playground', playground({
    'endpoint': '/',
  }))

  app.post('/', bodyParser.json({
    'limit': 120000,
  }), graphqlExpress(backend))
}
