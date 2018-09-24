import playground from 'graphql-playground-middleware-express'

export default async ({app,}) => {
  app.get('/playground', playground({
    'endpoint': '/',
  }))
}
