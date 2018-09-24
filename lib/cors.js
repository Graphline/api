import cors from 'cors'

export default async ({app,}) => {
  const origin = process.env.CORS_ORIGINS.split(',')

  if (process.env.NODE_ENV === 'development') {
    origin.push(`http://${process.env.DOMAIN}`)
  }

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
