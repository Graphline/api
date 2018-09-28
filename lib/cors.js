import cors from 'cors'

export default async ({app,}) => {
  const origin = `${process.env.PROTOCOL}://${process.env.FQDN}`

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
